/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ICustomClusterClient } from 'kibana/server';
import { Cluster } from 'src/legacy/core_plugins/elasticsearch';
// @ts-ignore
import { getAllStats } from './get_all_stats';
import { getClusterUuids } from './get_cluster_uuids';

export function registerMonitoringCollection(
  cluster: ICustomClusterClient,
  telemetryCollectionManager: any
) {
  // Create a legacy wrapper since telemetry is still in the legacy plugins
  const legacyCluster: Cluster = {
    callWithRequest: async (req: any, endpoint: string, params: any) =>
      cluster.asScoped(req).callAsCurrentUser(endpoint, params),
    callWithInternalUser: () => {
      throw new Error(
        'callWithInternalUser is not supported in this context. Please use `callWithRequest`'
      );
    },
  };
  telemetryCollectionManager.setCollection({
    esCluster: legacyCluster,
    title: 'monitoring',
    priority: 2,
    statsGetter: getAllStats,
    clusterDetailsGetter: getClusterUuids,
  });
}
