/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotFound } from 'http-errors';

import { Controller, Router, Get, RenderJSON, RouteParam, QueryParam, Post, Delete } from '../../../cp3-express';

import { Image } from '../../../models';

@Router("/api/v1/images")
export class ImagesApiV1Controller extends Controller<ImagesApiV1Controller> {

    protected imageToJSON(image: Image) {
        return {
            Id: image.id,
            Guid: image.guid,
            Format: image.extension,
            Url: image.url,
            Size: image.size,
            Width: image.width,
            Height: image.height,
            CreatedAt: image.createdAt,
            UpdatedAt: image.updatedAt
        };
    }

    @Get("/")
    @RenderJSON()
    protected async getAllImages(
        @QueryParam("offset") offset: number | null,
        @QueryParam("limit") limit: number | null
    ) {
        offset = offset || 0;
        limit = Math.min(100, limit || 50);

        const { count: Total, rows: Images } = await Image.findAndCountAll({
            offset,
            limit
        });

        const Results = Images.map(i => this.imageToJSON(i));

        return { Results, Count: Results.length, Offset: offset, Limit: limit, Total };

    }

    @Get("/:id")
    @RenderJSON()
    protected async getImage(@RouteParam('id') imageId: number) {

        const image = await Image.findByPk(imageId);

        if (image) return this.projectToJSON(image);
        else throw new NotFound("That Image doesn't exist.");

    }

    @Post("/")
    @RenderJSON()
    protected async createImage() {
        //
    }

    @Delete("/:id")
    @RenderJSON()
    protected async deleteImage() {
        //
    }

}
