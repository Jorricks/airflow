/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import axios from 'axios';
import { useMutation } from 'react-query';
import { getMetaValue } from 'src/utils';
import useErrorToast from '../utils/useErrorToast';

const setTaskInstancesNotesURI = getMetaValue('set_task_instance_note');

export default function useSetTaskInstanceNotes(
  dagId: string,
  runId: string,
  taskId: string,
  mapIndex: number,
  newNotesValue: string,
) {
  const errorToast = useErrorToast();
  // Note: Werkzeug does not like the META URL with an integer. It can not put _MAP_INDEX_ there
  // as it interprets that as the integer. Hence, we pass -1 as the integer. To avoid we replace
  // other stuff, we add _TASK_ID_ to the replacement query.
  const url = setTaskInstancesNotesURI
    .replace('_DAG_RUN_ID_', runId)
    .replace('_TASK_ID_', taskId);

  const params = { map_index: mapIndex, notes: newNotesValue };
  return useMutation(
    ['setTaskInstanceNotes', dagId, runId],
    () => axios.patch(url, params),
    {
      onError: (error: Error) => errorToast({ error }),
    },
  );
}
