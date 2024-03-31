import MessageType from "sap/ui/core/message/MessageType";
import JSONModel from "sap/ui/model/json/JSONModel";

type Message = {
    message: string;
    type?: MessageType;
};

export enum Version {
    V2 = "/v2",
    V4 = "/v4",
}

class CustomUiLogger {
    public jsonModel: JSONModel;

    constructor() {
        this.jsonModel = new JSONModel({
            v2: [],
            v4: [],
        });
    }

    public addMessage(content: Message, version: Version = Version.V2) {
        if (!content?.type) {
            content.type = MessageType.Information;
        }
        const arr = this.jsonModel.getProperty(version) as Message[];
        this.jsonModel.setProperty(version, arr.concat(content));
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
