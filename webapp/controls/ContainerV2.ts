import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import ChangeReason from "sap/ui/model/ChangeReason";
import Item from "./ItemV2";
import { CustomLogger, MessageType } from "../util/CustomUiLogger";

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
    };

    public static readonly renderer = {
        apiVersion: 2,
        render(rm: RenderManager, container: ContainerV2): void {
            CustomLogger.addV2Message({
                message: "CONTAINER:RENDER: entry",
                type: MessageType.Warning,
            });
            rm.openStart("div", container).class("container");
            rm.openEnd();
            container.getItems().forEach((item: Item) => {
                CustomLogger.addV2Message({
                    message: `CONTAINER:RENDER: item: ${item.getId()}`,
                    type: MessageType.Warning,
                });
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
        CustomLogger.addV2Message({ message: "CONTAINER: updateItems()" });
        return this.updateAggregation("items", ChangeReason.Change, {});
    }

    public insertItem(item: Item, index: number): this {
        CustomLogger.addV2Message({ message: "CONTAINER: insertItem()" });
        this.insertAggregation("items", item, index, true);
        // Obtain DOM ref
        const domRef = this.getDomRef();
        // If not rendered, or an invisible item - we need to invalidate
        if (!domRef || !item.getVisible()) {
            this.invalidate();
            return this;
        }
        // Prepare render manager instance
        // Core.createRenderManager(); -> API is from v1.119; You can still do it yourself:
        const rm = new RenderManager().getInterface();
        // Render new item
        rm.render(item, domRef);
        rm.destroy();
        return this;
    }

    public removeItem(item: Item | number | string): Item | null {
        CustomLogger.addV2Message({ message: "CONTAINER: removeItem()" });
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

    public override onAfterRendering(event: JQuery.Event): void {
        CustomLogger.addV2Message({ message: "CONTAINER: onAfterRendering()" });
        super.onAfterRendering(event);
    }
}
