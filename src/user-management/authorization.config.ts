import { ActionType } from "src/authorization/consts";

export default {
    policies: [
        {
            policyName: "fullAccessProfile",
            entity: "ProfileEntity",
            actions: [
                "findProfile",
                { name: "updateProfile", type: ActionType.resource },
                { name: "uploadAvatar", type: ActionType.resource }
            ]
        },

        {
            policyName: "fullAccessUser",
            entity: "UserEntity",
            actions: [
                "createUser",
                "getUserByID",
                "getOnlineStatus",
                { name: "updatePassword", type: ActionType.resource },
                { name: "updateOnlineStatus", type: ActionType.resource }
            ]
        }
    ],
    assigns: {
        user: [
            ["ProfileEntity", "fullAccessProfile"],
            ["UserEntity", "fullAccessUser"]
        ],
        admin: [
            ["ProfileEntity", "fullAccessProfile"],
            ["UserEntity", "fullAccessUser"]
        ]
    }
}