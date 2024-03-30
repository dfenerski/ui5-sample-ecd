import Control from "sap/ui/core/Control";
import Core from "sap/ui/core/Core";
import RenderManager from "sap/ui/core/RenderManager";
import ChangeReason from "sap/ui/model/ChangeReason";
import Item from "./Item";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controls
 */
export default class Container extends Control {
    public static readonly metadata = {
        aggregations: {
            items: {
                type: "com.github.dfenerski.ui5_sample_ecd.controls.Item",
                multiple: true,
            },
        },
    };

    public static readonly renderer = {
        apiVersion: 4,
        render(rm: RenderManager, container: Container): void {
            rm.openStart("div", container);
            rm.openEnd();
            container.getItems().forEach((item: Item) => {
                rm.renderControl(item);
            });
            rm.close("div");
        },
    };

    public readonly bUseExtendedChangeDetection = true;

    /**
     * This override does nothing but is useful to have it explicitly defined when doing custom aggregation stuff
     */
    public updateItems() {
        console.error("CONTAINER: updateItems");
        return this.updateAggregation("items", ChangeReason.Change, {});
    }

    public insertItem(item: Item, index: number): this {
        console.error("CONTAINER: insertItem");
        this.insertAggregation("items", item, index, true);
        // Obtain DOM references
        const domRef = this.getDomRef();
        // If not rendered, or an invisible item - we need to invalidate
        if (!domRef || !item.getVisible()) {
            this.invalidate();
            //
            return this;
        }
        // Prepare render manager instance
        const rm = Core.createRenderManager();
        // Render new item
        rm.render(item, domRef);
        rm.destroy();
        //
        return this;
    }

    public removeItem(item: Item | number | string): Item | null {
        console.error("CONTAINER: insertItem");
        const removedItem = <Item | null>(
            this.removeAggregation("items", item, true)
        );
        const domRef = this.getDomRef();
        const itemDomRef = removedItem?.getDomRef();
        // Abort if no dom refs
        if (!domRef || !itemDomRef) {
            this.invalidate();
            return removedItem;
        }
        // Remove child from dom
        domRef.removeChild(itemDomRef);
        //
        return removedItem;
    }

    public override onAfterRendering(event: JQuery.Event): void {
        console.error("CONTAINER: onAfterRendering");
        super.onAfterRendering(event);
    }
}
