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

import React, { useState } from 'react';
import { useSetDagRunUserNote } from '../../../api';

const SetDagRunUserNote = ({ dagId, runId, initialValue }) => {
  const [userNote, setUserNote] = useState(initialValue == null ? '' : initialValue);
  const { mutateAsync: markFailed, isLoading } = useSetDagRunUserNote(dagId, runId, userNote);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await markFailed(runId, dagId, (userNote === null) ? '' : userNote);
    // @ToDo(jorrick) remove this.
    console.log(isLoading);
  };

  return (
    <form onSubmit={handleSubmit}>
      Enter some information :)
      <input
        type="textarea"
        id="someID"
        value={(userNote === null) ? '' : userNote}
        onChange={(e) => setUserNote(e.target.value)}
      />
      <p>{userNote}</p>
      <button type="submit">Update note</button>
    </form>
  );
};

export default SetDagRunUserNote;
