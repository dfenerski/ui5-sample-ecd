import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controls
 */
export default class ItemV4 extends Control {
    public static readonly metadata = {
        properties: {
            text: { type: "string", defaultValue: "" },
        },
    };

    public static readonly renderer = {
        apiVersion: 4,
        render(rm: RenderManager, item: ItemV4): void {
            rm.openStart("div", item);
            rm.openEnd();
            rm.text(item.getText());
            rm.close("div");
        },
    };
}
