const namedMedicationPattern = /\b(?:paracetamol|ibuprofen|amoxicillin|phenoxymethylpenicillin|linctus|salbutamol|beclometasone|furosemide|amlodipine|ramipril|metformin|gliclazide|empagliflozin|levothyroxine|carbimazole|omeprazole|antacid|metoclopramide|ondansetron|cyclizine|loperamide|macrogol|senna|gtn|aspirin|betahistine|prochlorperazine|ferrous|cefalexin|calamine|chlorphenamine|cocp|naproxen|tranexamic|mefenamic|diclofenac|colchicine|prednisolone|amitriptyline|mometasone|dexamethasone|cyclopentolate|chloramphenicol|ofloxacin|apixaban|enoxaparin|co-amoxiclav|clarithromycin|sumatriptan|propranolol|topiramate|levetiracetam|lamotrigine|gabapentin|clopidogrel|doxycycline|gaviscon|mesalazine|mebeverine|bisacodyl|semaglutide|spironolactone|nitrofurantoin|tamsulosin|dapagliflozin|insulin|adrenaline|epinephrine|hydrocortisone|terbinafine|minoxidil|morphine|cetirizine|ranitidine|lymecycline|betamethasone|sertraline|oxymetazoline|adapalene|benzoyl|ticagrelor|cholestyramine|anusol|vitamin d|mmr|pcv)\b|hib\/menc/i;
const medicationContextPattern = /\b(?:medication|antibiotic|anticoagulation|analgesia|antipyretic|insulin|vaccine|vaccination|anti-d|ppi|ics|laba|lama|dapt|nsaid|steroid|inhaler|antihypertensive|diuretic|statin|sulfonylurea|antifibrotic|triple therapy|h\. pylori eradication|b12 injections)\b/i;
const administrationPattern = /\b(?:qds|tds|bd|od|prn|nocte|stat|daily|weekly|hourly|dose|titrate|titration|started|start|add|continue|continued|increase|increased|reduce|reduced|adjusted|administered|given|prescri(?:be|bed|ption)|therapy|treatment|puffs?|tablets?|sachets?|infusion|injection|iv|im|sc|po|sl)\b|\/kg|\b\d+(?:\.\d+)?\s*(?:mg|mcg|ml|mL|g|%)\b|(?:\bx\s*\d+\s*(?:d|day|days|wk|wks|week|weeks)\b)|(?:×\s*\d+\s*(?:d|day|days|wk|wks|week|weeks)\b)|(?:\bfor\s*\d+\s*(?:d|day|days|wk|wks|week|weeks)\b)/i;
const genericDocumentationPattern = /^(?:(?:antipyretic|analgesia|symptomatic treatment|medication safety) advice|medication (?:review|adherence|safety) advice) (?:discussed|documented)(?:\.|$)|^analgesia ladder discussed(?:\.|$)/i;

function isUnsafeAutofillSelection(group, value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (group !== "plan_phrases") return false;
  if (genericDocumentationPattern.test(text)) return false;
  if (!administrationPattern.test(text)) return false;
  return namedMedicationPattern.test(text) || medicationContextPattern.test(text);
}

module.exports = {
  namedMedicationPattern,
  medicationContextPattern,
  administrationPattern,
  genericDocumentationPattern,
  isUnsafeAutofillSelection
};
