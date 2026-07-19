import { blSame } from '../../lib/mlContent.js';

// Module 11 audit: every domain lab (Gold/Macro/Micro/Politics) repeats a
// handful of section labels verbatim. Centralized here once discovered
// during the bilingual pass, rather than re-translated identically four
// times — see BUILD_LOG.md Module 11.
export const UI_SCENARIO_PRESETS = blSame('Scenario presets', 'Scenario ခန့်မှန်းစဉ်များ');
export const UI_RESET_TO_BASELINE = blSame('Reset to baseline', 'အခြေခံအဆင့်သို့ ပြန်သတ်မှတ်ရန်');

// MLCitation is mounted on nearly every page in every module — found
// hardcoded during the Module 11 pass while spot-checking Playground.
export const UI_ILLUSTRATIVE_DATA = blSame(
  'Illustrative data, calibrated to real-world patterns',
  'သရုပ်ဖော်ဒေတာ — လက်တွေ့ pattern များနှင့် ကိုက်ညီအောင် ချိန်ညှိထားသည်'
);
export const UI_SOURCE_LBL = blSame('Source', 'ရင်းမြစ်');
