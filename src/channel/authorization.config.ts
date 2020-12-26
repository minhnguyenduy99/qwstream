import { ActionType } from "src/authorization/consts";

export default {
    policies: [
        {
            policyName: "fullAccessChannel",
            entity: "ChannelEntity",
            actions: [
                "createChannel",
                "updateChannelInfo",
                "uploadAvatar",
                "deleteChannelByCid"
            ]
        },

        {
            policyName: "fullAccessFollow",
            entity: "FollowEntity",
            actions: [
                { name: "onFollow", type: ActionType.resource },
                { name: "onUnFollow", type: ActionType.resource }
            ]
        }
    ],
    assigns: {
        channel: [
            ["ChannelEntity", "fullAccessChannel"],
            ["FollowEntity", "fullAccessFollow"]
        ],
        user: [
            ["FollowEntity", "fullAccessFollow"]
        ],
        admin: [
            ["ChannelEntity", "fullAccessChannel"],
            ["FollowEntity", "fullAccessFollow"]
        ]
    }
}