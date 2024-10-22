import { healStaminaUnits } from "../healStamina";
import type { Spell } from '../../types/cards';
const {
  commonTypes,
} = globalThis.SpellmasonsAPI;

const { CardCategory, probabilityMap, CardRarity } = commonTypes;


export const revitaliseCardId = 'Revitalise';
const revitaliseAmount = 100;

const spell: Spell = {
  card: {
    id: revitaliseCardId,
    category: CardCategory.Blessings,
    //sfx: healSfx, // Heal FX Handled in Unit.takeDamage()
    supportQuantity: true,
    manaCost: 15,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap[CardRarity.COMMON],
    thumbnail: 'spellmasons-mods/Bogiacs_Spells/graphics/icons/Revitalise.png',
    animationPath: 'potionPickup',
    description: 'Restores ' + revitaliseAmount.toString() + ' stamina to the target.',
    effect: async (state, card, quantity, underworld, prediction) => {
      await healStaminaUnits(state.targetedUnits, revitaliseAmount * quantity, state.casterUnit, underworld, prediction, state);
      return state;
    },
  },
};
export default spell;
