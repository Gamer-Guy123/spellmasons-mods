import { Spell } from '../../types/cards';


const {
  Particles,
  commonTypes,
  Unit,
  EffectsHeal,
  cards,
} = globalThis.SpellmasonsAPI;
const { CardCategory, probabilityMap, CardRarity } = commonTypes;
const { refundLastSpell } = cards;
export const siphonCardId = 'Siphon';
const amount = 10;
const delayBetweenAnimations = 400;

const spell: Spell = {
  card: {
    id: siphonCardId,
    category: CardCategory.Mana,
    sfx: 'potionPickupMana',
    supportQuantity: true,
    manaCost: 5,
    healthCost: 5,
    expenseScaling: 2,
    probability: probabilityMap[CardRarity.FORBIDDEN],
    thumbnail: 'spellmasons-mods/Bogiacs_Spells/graphics/icons/Siphon.png',
    animationPath: 'potionPickup',
    description: `Drain 10 health and 10 mana from targets.`,
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter(u => u.alive);
      let promises = [];
      let manaStolen = 0;
      let healthStolen = 0;
      let amountStolen = amount * quantity;
      for (let unit of targets) {
        for (let i = 0; i < quantity; i++) {
          const manaStolenFromUnit = Math.min(unit.mana, amountStolen);
          unit.mana -= manaStolenFromUnit;
          manaStolen += manaStolenFromUnit;
          const healthStolenFromUnit = Math.min(unit.health, amountStolen);
          healthStolen += healthStolenFromUnit;

          Unit.takeDamage({
            unit: unit,
            amount: healthStolenFromUnit,
            sourceUnit: state.casterUnit,
            fromVec2: state.casterUnit,
          }, underworld, prediction);

          //health trail
          if (!globalThis.headless && !prediction) {

            promises.push(Particles.makeManaTrail(unit, state.casterUnit, underworld, '#fff9e4', '#ffcb3f', targets.length * quantity));

            await new Promise(resolve => setTimeout(resolve, delayBetweenAnimations));

            //mana trail
            promises.push(Particles.makeManaTrail(unit, state.casterUnit, underworld, '#e4f9ff', '#3fcbff', targets.length * quantity));
          }
        }
      }
      await Promise.all(promises);
      state.casterUnit.mana += manaStolen;
      EffectsHeal.healUnit(state.casterUnit, healthStolen, state.casterUnit, underworld, prediction, state);
      if (healthStolen == 0 && manaStolen == 0) {
        refundLastSpell(state, prediction)
      }
      return state;
    },
  },
};
export default spell;
