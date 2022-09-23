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
import useErrorToast from '../utils/useErrorToast';

interface Props {
  dagId: string;
  runId: string;
  newUserNoteValue: string;
}

export default function UseSetDagRunUserNote({ dagId, runId, newUserNoteValue }: Props) {
  const errorToast = useErrorToast();
  const setDagRunUserNote = (`/api/v1/dags/${dagId}/dagRuns/_DAG_RUN_ID_/setNote`)
    .replace('_DAG_RUN_ID_', runId);

  return useMutation(
    ['dagRunFailed', dagId, runId],
    () => axios.patch(setDagRunUserNote, { user_notes: newUserNoteValue }),
    {
      onSuccess: () => {
        console.log('Success <3');
      },
      onError: (error: Error) => errorToast({ error }),
    },
  );
}
