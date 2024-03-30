import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Container" {
    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ContainerSettings extends $ControlSettings {
        items?: Item[] | AggregationBindingInfo | `{${string}}`;
    }

    export default interface Container {
        // aggregation: items
        getItems(): Item[];
        addItem(item: Item): this;
        insertItem(item: Item, index: number): this;
        removeItem(item: number | string): this;
        removeAllItems(): Item[];
        indexOfItem(item: Item): number;
        destroyItems(): this;
    }
}
