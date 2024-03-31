import ItemV4 from "com/github/dfenerski/ui5_sample_ecd/controls/ItemV4";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ContainerV4" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ContainerV4Settings extends $ControlSettings {
        items?: ItemV4[] | ItemV4 | AggregationBindingInfo | `{${string}}`;
    }

    export default interface ContainerV4 {

        // aggregation: items

        /**
         * Gets content of aggregation "items".
         */
        getItems(): ItemV4[];

        /**
         * Adds some item to the aggregation "items".
         *
         * @param item The item to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addItem(items: ItemV4): this;

        /**
         * Inserts a item into the aggregation "items".
         *
         * @param item The item to insert; if empty, nothing is inserted
         * @param index The "0"-based index the item should be inserted at; for
         *              a negative value of "iIndex", the item is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the item is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertItem(items: ItemV4, index: number): this;

        /**
         * Removes a item from the aggregation "items".
         *
         * @param item The item to remove or its index or id
         * @returns The removed item or "null"
         */
        removeItem(items: number | string | ItemV4): this;

        /**
         * Removes all the controls from the aggregation "items".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllItems(): ItemV4[];

        /**
         * Checks for the provided "com.github.dfenerski.ui5_sample_ecd.controls.ItemV4" in the aggregation "items".
         * and returns its index if found or -1 otherwise.
         *
         * @param item The item whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfItem(items: ItemV4): number;

        /**
         * Destroys all the items in the aggregation "items".
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyItems(): this;
    }
}
