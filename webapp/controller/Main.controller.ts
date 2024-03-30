import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controller
 */
export default class Main extends BaseController {
    public sayHello(): void {
        MessageBox.show("Hello World!");
    }

    public handleItemAddition() {
        const localModel = <JSONModel>this.getModel("local");
        const items = <{ text: string }[]>localModel.getProperty("/items");
        localModel.setProperty("/items", [...items, { text: Math.random() }]);
    }

    public handleItemRemoval() {
        const localModel = <JSONModel>this.getModel("local");
        const items = <{ text: string }[]>localModel.getProperty("/items");
        const lastItemIndex = items.length - 1;
        localModel.setProperty(
            "/items",
            items.filter((_, i) => i !== lastItemIndex)
        );
    }
}
