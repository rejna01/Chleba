import Styles from "./DND_Denik.module.css";
import { useState } from "react";

function DND_Denik() {
  const [editing, setEditing] = useState(true);
  return (
    <div className={Styles.sheet}>
      {/* LEFT COLUMN */}
      <div className={Styles.leftColumn}>
        <section className={Styles.abilityScores}>
          <div className={Styles.ability}>
            <label htmlFor="strength">Strength</label>
            <input id="strength"></input>
            <input id="strength"></input>
          </div>
          <div className={Styles.ability}>
            <label htmlFor="dexterity">Dexterity</label>
            <input id="dexterity"></input>
            <input id="strength"></input>
          </div>
          <div className={Styles.ability}>
            <label htmlFor="constitution">Constitution</label>
            <input id="constitution"></input>
            <input id="strength"></input>
          </div>
          <div className={Styles.ability}>
            <label htmlFor="strength">Intelligence</label>
            <input id="strength"></input>
            <input id="strength"></input>
          </div>
          <div className={Styles.ability}>
            <label htmlFor="wisdom">Wisdom</label>
            <input id="wisdom"></input>
            <input id="strength"></input>
          </div>
          <div className={Styles.ability}>
            <label htmlFor="charisma">Charisma</label>
            <input id="charisma"></input>
            <input id="strength"></input>
          </div>
        </section>

        <section className={Styles.abilityOther}>
          <section className={Styles.inspiration}>INSPIRATION</section>
          <section className={Styles.proficiency_bonus}>
            PROFICIENCY BONUS
          </section>

          <section className={Styles.savingThrows}>
            <div className={Styles.savingThrow}>Strength</div>
            <div className={Styles.savingThrow}>Dexterity</div>
            <div className={Styles.savingThrow}>Constitution</div>
            <div className={Styles.savingThrow}>Intelligence</div>
            <div className={Styles.savingThrow}>Wisdom</div>
            <div className={Styles.savingThrow}>Charisma</div>
            <div>Saving Throws</div>
          </section>

          <section className={Styles.skills}>
            <div className={Styles.skill}>Acrobatics</div>
            <div className={Styles.skill}>Animal Handling</div>
            <div className={Styles.skill}>Arcana</div>
            <div className={Styles.skill}>Athletics</div>
            <div className={Styles.skill}>Deception</div>
            <div className={Styles.skill}>History</div>
            <div className={Styles.skill}>Insight</div>
            <div className={Styles.skill}>Intimidation</div>
            <div className={Styles.skill}>Investigation</div>
            <div className={Styles.skill}>Medicine</div>
            <div className={Styles.skill}>Nature</div>
            <div className={Styles.skill}>Perception</div>
            <div className={Styles.skill}>Performance</div>
            <div className={Styles.skill}>Persuasion</div>
            <div className={Styles.skill}>Religion</div>
            <div className={Styles.skill}>Sleight of Hand</div>
            <div className={Styles.skill}>Stealth</div>
            <div className={Styles.skill}>Survival</div>
          </section>
        </section>

        <section className={Styles.passiveSection}>Passive Perception</section>

        <section className={Styles.proficiencies}>
          Proficiencies & Languages
        </section>
      </div>

      {/* CENTER COLUMN */}
      <div className={Styles.centerColumn}>
        <section className={Styles.fancyBox}>
          <section className={Styles.acInitSpeed}>
            <div className={`${Styles.ac} ${Styles.box}`}>AC</div>
            <div className={`${Styles.init} ${Styles.box}`}>Initiative</div>
            <div className={`${Styles.speed} ${Styles.box}`}>Speed</div>
          </section>

          <section className={`${Styles.hitPoints} ${Styles.box}`}>
            Hit Points
          </section>

          <section className={Styles.hitDeath}>
            <div className={`${Styles.hitDice} ${Styles.box}`}>Hit Dice</div>
            <div className={`${Styles.hitDice} ${Styles.box}`}>Death Saves</div>
          </section>
        </section>

        <section className={`${Styles.attacksCenter} ${Styles.box}`}>
          Attacks Table
        </section>

        <section className={Styles.attacksLeft}>Attacks & Spellcasting</section>

        <section className={`${Styles.featuresTraits} ${Styles.box}`}>
          Features & Traits
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className={Styles.rightColumn}>
        <section className={Styles.fancyBox}>
          <section className={Styles.box}>Personality Traits</section>
          <section className={Styles.box}>Ideals</section>
          <section className={Styles.box}>Bonds</section>
          <section className={Styles.box}>Flaws</section>
        </section>
        <section className={Styles.box}>FEATURES & TRAITS</section>
      </div>
    </div>
  );
}

export default DND_Denik;
