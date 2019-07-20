/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, ForeignKey, AllowNull } from 'sequelize-typescript';

import { Project } from './Project';
import { Link } from './Link';

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true
})
export class ProjectLink extends Model<ProjectLink> {

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column
  projectId!: number;

  @ForeignKey(() => Link)
  @AllowNull(false)
  @Column
  linkId!: number;

}
