import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ParsePagePipe } from "@helpers/pagination";
import { StreamSearchInput, GlobalStreamViewService, StreamWithSortedInput } from "../services";
import { IsPublicGuard } from "src/authentication/auth-local";
import { ObjectIdFormat, ParamValidationPipe, QueryValidationPipe } from "src/helpers/validation";
import { StreamNotExistException } from "../errors";


@Controller("streams")
@UseGuards(IsPublicGuard)
export class GlobalStreamController {

    constructor(
        private readonly globalStreamView: GlobalStreamViewService
    ) {
    }

    @Get("/sort")
    async sortStreams(
        @Query(QueryValidationPipe) sorter: StreamWithSortedInput,
        @Query("page", ParsePagePipe) page: number,
    ) {
        const result = await this.globalStreamView.sortAndPaginateStreams(page, sorter);
        return result;
    }

    @Get("/search")
    async searchForStreams(
        @Query(QueryValidationPipe) search: StreamSearchInput,
        @Query("page", ParsePagePipe) page: number
    ) {
        const { type, ...searchInput } = search;
        if (!type) {
            return this.globalStreamView.getGlobalStreamingInfo(page, searchInput);
        }
        if (type === "current") {
            return this.globalStreamView.getListGlobalCurrentStreamingInfo(page, searchInput);
        }
        return this.globalStreamView.getGlobalOldStreamingInfo(page, searchInput);
    }

    @Get("/categories/:category_id")
    async getStreamsByCategory(
        @Param("category_id", ParseIntPipe) categoryId: number,
        @Query("page", ParsePagePipe) page: number
    ) {
        return this.globalStreamView.getStreamsByCategory(categoryId, page);
    }

    @Get("/:stream_id")
    async getStreamById(
        @Param("stream_id", new ParamValidationPipe(ObjectIdFormat)) streamId: string
    ) {
        const stream = await this.globalStreamView.getStreamById(streamId);
        if (!stream) {
            throw new StreamNotExistException();
        }
        return stream;
    }
}