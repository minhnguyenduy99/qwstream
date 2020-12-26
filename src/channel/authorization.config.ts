import { ActionType } from "src/authorization/consts";

export default {
    policies: [
        {
            policyName: "createChannel",
            entity: "ChannelEntity",
            actions: [
                "createChannel"
            ]
        },
        {
            policyName: "fullAccessChannel",
            entity: "ChannelEntity",
            actions: [
                { name: "updateChannelInfo", type: ActionType.resource },
                { name: "uploadAvatar", type: ActionType.resource },
                { name: "deleteChannelByCid", type: ActionType.resource }
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
            ["FollowEntity", "fullAccessFollow"],
            ["ChannelEntity", "createChannel"]
        ],
        admin: [
            ["ChannelEntity", "fullAccessChannel"],
            ["FollowEntity", "fullAccessFollow"]
        ]
    }
}