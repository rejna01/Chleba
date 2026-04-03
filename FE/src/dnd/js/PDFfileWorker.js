import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

import { PDFDocument } from "pdf-lib";

// ruční mapování PDF názvů → id ve tvém arrayi
const fieldMap = {
    "CharacterName": "characterName",
    "ClassLevel": "classAndLevel",
    "Background": "background",
    "PlayerName": "playerName",
    "Race": "race",
    "Aligment": "aligment",
    "XP": "experiencePoints",
    "STRmod": "strengthBonus",
    "DEXmod": "dexterityBonus",
    "CONmod": "constitutionBonus",
    "INTmod": "intelligenceBonus",
    "WISmod": "wisdomBonus",
    "CHAmod": "charismaBonus",
    "STR": "strength",
    "DEX": "dexterity",
    "CON": "constitution",
    "INT": "intelligence",
    "WIS": "wisdom",
    "CHA": "charisma",
    "Inspiration": "inspiration",
    "ProfBonus": "proeficiencyBonus",
    "ST Strength": "savingThrowStrength",
    "ST Dexterity": "savingThrowDexterity",
    "ST Constitution": "savingThrowConstitution",
    "ST Intelligence": "savingThrowIntelligence",
    "ST Wisdom": "savingThrowWisdom",
    "ST Charisma": "savingThrowCharisma",
    "Acrobatics": "acrobatics",
    "Animal": "animalHandling",
    "Arcana": "arcana",
    "Athletics": "athletics",
    "Deception": "deception",
    "History": "history",
    "Insight": "insight",
    "Intimidation": "intimidation",
    "Investigation": "investigation",
    "Medicine": "medicine",
    "Nature": "nature",
    "Perception": "perception",
    "Performance": "performance",
    "Persuasion": "persuasion",
    "Religion": "religion",
    "SleightOfHand": "sleightOfHand",
    "Stealth": "stealth",
    "Survival": "survival",
    "Passive": "passiveWisdom",
    "ProficienciesLang": "otherProficienciesAndLanguages",
    "AC": "armorClass",
    "Initiative": "initiative",
    "Speed": "Speed",
    "HPMax": "currentHitPointsMaximum",
    "HPCurrent": "currentHitPoints",
    "HPTemp": "temporaryHitPoints",
    "HDTotal": "totalHitDice",
    "HD": "hitDice",
    "Wpn Name": "weaponName1",
    "Wpn1 AtkBonus": "weaponAttackBonus1",
    "Wpn1 Damage": "weaponDamage1",
    "Wpn Name 2": "weaponName2",
    "Wpn2 AtkBonus": "weaponAttackBonus2",
    "Wpn2 Damage": "weaponDamage2",
    "Wpn Name 3": "weaponName3",
    "Wpn3 AtkBonus": "weaponAttackBonus3",
    "Wpn3 Damage": "weaponDamage3",
    "AttacksSpellcasting": "attacsAndSpellcasting",
    "CP": "cp",
    "SP": "sp",
    "EP": "ep",
    "GP": "gp",
    "PP": "pp",
    "Equipment": "equipment",
    "PersonalityTraits": "personalityTraits",
    "Ideals": "ideals",
    "Bonds": "bonds",
    "Flows": "flaws",
    "Features and Traits": "featuresAndTraits",
    "CharacterName 2": "characterName2",
    "Age": "age",
    "Height": "height",
    "Weight": "weight",
    "Eyes": "eyes",
    "Skin": "skin",
    "Hair": "hair",
    "Appearance": "appearance",
    "Backstory": "backstory",
    "Allies": "alliesAndOrganizations",
    "FactionName": "alliesAndOrganizationsName",
    "Faction Symbol Image": "alliesAndOrganizationsSymbol",
    "Feat+Traits": "additionalFeaturesAndTraits",
    "Treasure": "treasure",
    "Spellcasting Class 2": "spellcastingClass",
    "Spellcasting Ability 2": "spellcastingAbility",
    "SpellSaveDC 2": "spellSaveDC",
    "SpellAtkBonus 2": "spellAttackBonus",
    "Spells 1014": "cantrips1",
    "Spells 1016": "cantrips2",
    "Spells 1017": "cantrips3",
    "Spells 1018": "cantrips4",
    "Spells 1019": "cantrips5",
    "Spells 1020": "cantrips6",
    "Spells 1021": "cantrips7",
    "Spells 1022": "cantrips8"
}

// otočená mapa pro rychlé hledání
const reversedMap = Object.fromEntries(
  Object.entries(fieldMap).map(([pdfName, appId]) => [appId, pdfName])
);

/**
 * Načte PDF a namapuje hodnoty do field.fields
 * @param {Object} fieldObj - objekt obsahující array fieldObj.fields
 * @returns {Promise<Object>} - nový objekt se stejnou strukturou, vyplněnými hodnotami
 */
export function openAndReadPdf(fieldObj) {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return reject("No file selected");

      try {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(buffer).promise;

        const resultFields = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const annotations = await page.getAnnotations();

          const fields = annotations
            .filter(a => a.subtype === "Widget")
            .map(f => ({
              name: f.fieldName,
              value: f.fieldValue,
              type: f.fieldType,
              page: i
            }));

          resultFields.push(...fields);
        }

        // PDF → dictionary pro rychlý lookup
        const pdfDict = Object.fromEntries(
            resultFields.map(f => [f.name.trim(), f.value?.trim()])
        );
        
        console.log("Filled Field Object:", fieldObj.fields);
        console.log("Filled Field Object:", resultFields);
        // mapování do fieldObj.fields
        const mappedFields = fieldObj.fields.map(f => ({
          ...f,
          value: pdfDict[reversedMap[f.id]] ?? f.value
        }));

        // vrátíme nový objekt se stejnou strukturou
        resolve({
          ...fieldObj,
          fields: mappedFields
        });

      } catch (err) {
        reject(err);
      }
    };

    input.click();
  });
}

async function fillPdfWithFields(templateBuffer, fieldObj) {
  const pdfDoc = await PDFDocument.load(templateBuffer);
  const form = pdfDoc.getForm();

  fieldObj.fields.forEach(f => {
    const pdfFieldName = reversedMap[f.id];
    if (!pdfFieldName) return; // pole nemapováno, přeskočíme

    try {
      const pdfField = form.getTextField(pdfFieldName);
      pdfField.setText(f.value || "");
    } catch (err) {
      console.warn(`PDF pole "${pdfFieldName}" nenalezeno`);
    }
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function saveFilledPdf(fieldObj) {
    const res = await fetch("/template.pdf");
    const templateBuffer = await res.arrayBuffer();

    // 3️⃣ Vyplň PDF
    const filledPdf = await fillPdfWithFields(templateBuffer, fieldObj);

    // 4️⃣ Stáhni výsledný PDF
    const blob = new Blob([filledPdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filled.pdf";
    a.click();
    URL.revokeObjectURL(url);
}