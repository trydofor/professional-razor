import { defineComponent, computed, type Ref, type SlotsType } from 'vue'

const ModelSlot = defineComponent({
  name: 'ModelSlot',

  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  slots: Object as SlotsType<{
    default: (props: { model: Ref<number> }) => void
  }>,

  setup(props, { emit, slots }) {
    const model = computed({
      get: () => props.modelValue,
      set: v => emit('update:modelValue', v),
    })

    return () => (
      <div class="border border-solid p-4 border-1">
        <div>{ '👶 Child ' + model.value }</div>
        {slots.default?.({ model })}
        <div
          class="border border-solid cursor-pointer p-4 border-1 mt-2"
          onClick={() => model.value++}
        >
          👶 Child ++
        </div>
      </div>
    )
  },
})

export type ModelSlot = InstanceType<typeof ModelSlot>
export default ModelSlot
