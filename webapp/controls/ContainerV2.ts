import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import ChangeReason from "sap/ui/model/ChangeReason";
import { CustomLogger, MessageType } from "../util/CustomUiLogger";
import Item from "./ItemV2";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controls
 */
export default class ContainerV2 extends Control {
    public static readonly metadata = {
        aggregations: {
            items: {
                type: "com.github.dfenerski.ui5_sample_ecd.controls.ItemV2",
                multiple: true,
            },
        },
        defaultAggregation: "items",
    };

    public static readonly renderer = {
        apiVersion: 2,
        render(rm: RenderManager, container: ContainerV2): void {
            CustomLogger.addV2Message({
                message: "Container:render",
                type: MessageType.Information,
            });
            rm.openStart("div", container).class("container");
            rm.openEnd();
            container.getItems().forEach((item: Item) => {
                rm.renderControl(item);
            });
            rm.close("div");
        },
    };

    /**
     * Enable ECD by setting `bUseExtendedChangeDetection` flag
     */
    public readonly bUseExtendedChangeDetection = true;

    /**
     * Dedicated `updateAggregation` hook, overridden to demonstrate the lifecycle.
     */
    public updateItems() {
        CustomLogger.addV2Message({ message: "Container:updateItems" });
        return this.updateAggregation("items", ChangeReason.Change, {});
    }

    /**
     * Dedicated `insert` hook, needed to surpress the default invalidation & manually sync the DOM.
     * The default behavior of calling `this.insertAggregation` with invalidation won'do:
     * `Item` invalidates -> `Container` invalidates -> `Container` renders -> all `Item`s are rerendered, not only the modified one.
     * To avoid this, we supress `invalidation` propagation & sync the DOM ourselves, by rendering the new item synchronously.
     */
    public insertItem(item: Item, index: number): this {
        CustomLogger.addV2Message({ message: "Container:insertItem" });
        // Surpress invalidation, as this would result in unneccessary `item` rendering
        this.insertAggregation("items", item, index, true);
        // Obtain DOM ref, to manually patch it
        const domRef = this.getDomRef();
        // If not rendered, or an invisible item - we need to invalidate
        if (!domRef || !item.getVisible()) {
            this.invalidate();
            return this;
        }
        // Prepare render manager instance
        // Core.createRenderManager(); -> API is from v1.119; You can still do it yourself:
        const rm = new RenderManager(); // `.getInterface()` => not required but would replicate the `createRenderManager` implementation
        // Render new item
        rm.render(item, domRef);
        rm.destroy();
        return this;
    }

    /**
     * Dedicated `remove` hook, needed to surpress the default invalidation & manually sync the DOM.
     * The default behavior of calling `this.insertAggregation` with invalidation won'do:
     * `Item` invalidates -> `Container` invalidates -> `Container` renders -> all `Item`s are rerendered, not only the modified one.
     * To avoid this, we supress `invalidation` propagation & sync the DOM ourselves, by removing the new item manually.
     */
    public removeItem(item: Item | number | string): Item | null {
        CustomLogger.addV2Message({ message: "Container:removeItem" });
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
        return removedItem;
    }

    /**
     * Dedicated `onAfterRendering` hook, overridden to demonstrate the lifecycle.
     */
    public override onAfterRendering(event: JQuery.Event): void {
        CustomLogger.addV2Message({ message: "Container:onAfterRendering" });
        super.onAfterRendering(event);
    }
}
