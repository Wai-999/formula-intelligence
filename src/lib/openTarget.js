import { useUIStore } from '../store/useUIStore.js';
import { useMLUIStore } from '../store/useMLUIStore.js';

// A destination from search (or any other list of mixed results): a page,
// or a formula/model to select on its map, or an embedded ML lesson.
export function openTarget(target) {
  const ui = useUIStore.getState();
  if (target.formula) { ui.goTo('learn/formulas'); ui.selectNode(target.formula); return; }
  if (target.model) { ui.goTo('learn/models'); useMLUIStore.getState().selectModel(target.model); return; }
  if (target.mlLesson) { ui.openMLLesson(target.mlLesson); return; }
  ui.goTo(target.page, target.params ?? {});
}
