import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SayIt from '../SayIt.jsx';
import FormulaBreakdown from '../FormulaBreakdown.jsx';
import { formulaById } from '../../../data/curriculum/formulas.js';

// The reading is always shown; the speaker button only where the browser
// has its own speech synthesis, and it speaks locally.

afterEach(() => {
  cleanup();
  delete window.speechSynthesis;
  delete window.SpeechSynthesisUtterance;
});

function fakeVoice() {
  const spoken = [];
  window.speechSynthesis = { cancel: vi.fn(), speak: vi.fn((u) => spoken.push(u)) };
  window.SpeechSynthesisUtterance = class Utterance { constructor(text) { this.text = text; } };
  return spoken;
}

describe('SayIt', () => {
  it('shows the reading, with no button where the browser cannot speak', () => {
    render(<SayIt text="x bar" />);
    expect(screen.getByText('x bar')).toBeTruthy();
    expect(screen.getByText('Say')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('speaks the reading in English, with Greek names respelled for the voice', () => {
    const spoken = fakeVoice();
    render(<SayIt text="mu sub zero" />);
    fireEvent.click(screen.getByRole('button', { name: 'Hear it: mu sub zero' }));
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(spoken).toHaveLength(1);
    expect(spoken[0].text).toBe('mew sub zero');
    expect(spoken[0].lang).toBe('en-US');
  });

  it('chooses an English voice installed on the device over an online one', () => {
    const spoken = fakeVoice();
    const online = { name: 'Google US English', lang: 'en-US', localService: false };
    const device = { name: 'Samantha', lang: 'en-US', localService: true };
    window.speechSynthesis.getVoices = () => [online, { name: 'Thomas', lang: 'fr-FR', localService: true }, device];
    render(<SayIt text="x bar" />);
    fireEvent.click(screen.getByRole('button'));
    expect(spoken[0].voice).toBe(device);
  });

  it('renders nothing without a reading', () => {
    const { container } = render(<SayIt text={null} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('FormulaBreakdown', () => {
  it('reads the formula aloud and gives every symbol a row: symbol, how to say it, meaning', () => {
    const f = formulaById['f.break-even'];
    render(<FormulaBreakdown formula={f} />);
    expect(screen.getByText(f.say)).toBeTruthy();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(f.variables.length);
    expect(screen.getByText('q star')).toBeTruthy();
    expect(screen.getByText('units needed for zero profit')).toBeTruthy();
  });
});
