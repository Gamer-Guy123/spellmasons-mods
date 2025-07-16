import type { Spell } from '../../types/cards/index';

const {
  cardUtils,
  commonTypes,
  cards,
  VisualEffects,
  config,
  math,
  Pickup,
} = globalThis.SpellmasonsAPI;


const { refundLastSpell } = cards;
const { playDefaultSpellSFX } = cardUtils;
const { CardCategory, probabilityMap, CardRarity } = commonTypes;

const cardId = 'Summon Trap';
const spell: Spell = {
  card: {
    id: cardId,
    category: CardCategory.Damage,
    supportQuantity: true,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap[CardRarity.UNCOMMON],
    thumbnail: 'spellmasons-mods/Renes_gimmicks/graphics/icons/SummonTrap.png',
    sfx: 'hurt',
    description: [`Summons a trap that does 30 damage when stepped on`],
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const summonLocation = {
        x: state.castLocation.x,
        y: state.castLocation.y
      }
      // Ensure you're not summoning it on top of a unit already
      for(let unit of underworld.units){
            if (unit.alive && math.distance(unit, summonLocation) < config.COLLISION_MESH_RADIUS) {
              refundLastSpell(state, prediction, 'Invalid summon location, mana refunded.')
              return state;
            }
      }
      if (underworld.isCoordOnWallTile(summonLocation)) {
        if (prediction) {
          // const WARNING = "Invalid Summon Location";
          //addWarningAtMouse(WARNING);
        } else {
          refundLastSpell(state, prediction, 'Invalid summon location, mana refunded.')
        }
        return state;
      }
      playDefaultSpellSFX(card, prediction);
      const index = 0;
      //const index = Pickup.pickups.findIndex((p) => p.name === Pickup.PICKUP_SPIKES_NAME);
      if (!prediction) {
        VisualEffects.skyBeam(summonLocation)
        const pickup = underworld.spawnPickup(index, summonLocation, prediction);
        if(pickup){
          Pickup.setPower(pickup,quantity);
        }
      } else {
        const pickup = underworld.spawnPickup(index, summonLocation, prediction);
        if(pickup){
          Pickup.setPower(pickup,quantity);
        }

      }
      return state;
    },
  },
};
export default spell;