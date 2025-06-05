<template>
    <div class="inv-type-slip" :class="{ 'inv-type-slip--selected': selected }" 
         @click="selected = !selected"
         @mouseenter="processMouseEnter">
        <div class="inv-type-slip__icon">
            <img v-image-loaded :src="esiService.getBlueprintOriginalUrl(invType.typeId)" alt="Type Icon" />
        </div>
        <div class="inv-type-slip__name">
            {{ invType.typeName }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import esiService from "@/services/esiService";
import { type InvTypeDto } from "@api-client/models/inv-type-dto";
import { useStagingState } from "@/stores/useStagingStore";

export default defineComponent({
    name: "InvTypeSlip",
    data() {
        return {
            selected: false
        };
    },
    props: {
        invType: {
            type: Object as PropType<InvTypeDto>,
            required: true
        },
        parentMouseDown: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        esiService() {
            return esiService;
        },
        stagingStore() {
            return useStagingState();
        }
    },
    methods: {
        processMouseEnter() {
            if (this.parentMouseDown) {
                this.selected = true
            }
        }
    },
});
</script>
<style>
.inv-type-slip {
    display: flex;
    flex-direction: column;
    width: 64px;
    height: 110px;
    background-color: var(--eerie-black);
    justify-content: flex-start;
    user-select: none;
}

.inv-type-slip__icon {
    height: 64px;
}

.inv-type-slip__name {
    text-align: center;
    font-size: 0.6rem;
    color: var(--translucent-white-3);
}

.inv-type-slip--selected {
    background-color: var(--translucent-white-3);
}
</style>