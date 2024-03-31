import MessageType from "sap/ui/core/message/MessageType";
import JSONModel from "sap/ui/model/json/JSONModel";

type Message = {
    message: string;
    type?: MessageType;
};

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.util
 */
class CustomUiLogger {
    public jsonModel: JSONModel;

    constructor() {
        this.jsonModel = new JSONModel({
            v2: [],
            v4: [],
        });
    }

    public addV2Message(content: Message) {
        if (!content?.type) {
            content.type = MessageType.Information;
        }
        const arr = this.jsonModel.getProperty("/v2") as Message[];
        this.jsonModel.setProperty("/v2", [...arr, content]);
    }

    public addV4Message(content: Message) {
        if (!content?.type) {
            content.type = MessageType.Information;
        }
        const arr = this.jsonModel.getProperty("/v4") as Message[];
        this.jsonModel.setProperty("/v4", [...arr, content]);
    }

    public reset() {
        this.jsonModel.setData({
            v2: [],
            v4: [],
        });
    }
}

const instance = new CustomUiLogger();

export { instance as CustomLogger, MessageType };
