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
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Text,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { getMetaValue } from '../../utils';
import { useSetDagRunNotes, useSetTaskInstanceNotes } from '../../api';

const canEdit = getMetaValue('can_edit') === 'True';

const SetDagTaskNotes = ({
  dagId, runId, taskId, mapIndex, initialValue, updateApiDataFunction,
}) => {
  const [notes, setNotes] = useState(initialValue == null ? '' : initialValue);
  const [noteBeforeEdit, setNoteBeforeEdit] = useState('');
  const [editMode, changeEditMode] = useState(false);
  const {
    mutateAsync: apiCallToSetDagRunNote, dagRunIsLoading,
  } = useSetDagRunNotes(dagId, runId, notes);
  const {
    mutateAsync: apiCallToSetTINote, tiIsLoading,
  } = useSetTaskInstanceNotes(dagId, runId, taskId, (mapIndex || -1), notes);

  const objectIdentifier = (taskId == null) ? 'DAG Run' : 'Task Instance';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskId == null) {
      await apiCallToSetDagRunNote();
    } else {
      await apiCallToSetTINote();
    }
    updateApiDataFunction(notes);
    changeEditMode(false);
  };

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem style={{ border: 0 }}>
        <AccordionButton style={{ padding: 0, paddingBottom: '10px', fontSize: 'inherit' }}>
          <Box flex="1" textAlign="left">
            <Text as="strong" size="lg">
              {objectIdentifier}
              {' '}
              Notes:
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel style={{ padding: '0 0 15px 0' }}>
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div>
                <TextareaAutosize
                  minRows={1}
                  maxRows={10}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Button type="submit" isLoading={dagRunIsLoading || tiIsLoading}>
                  Update user notes
                </Button>
                <Button
                  onClick={() => { setNotes(noteBeforeEdit); changeEditMode(false); }}
                  isLoading={dagRunIsLoading || tiIsLoading}
                  style={{ marginLeft: '15px' }}
                >
                  Discard edit
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p style={{ whiteSpace: 'pre-line' }}>{notes}</p>
              <Button
                onClick={() => { setNoteBeforeEdit(notes); changeEditMode(true); }}
                isDisabled={!canEdit}
                isLoading={dagRunIsLoading || tiIsLoading}
                style={{ marginTop: '10px' }}
              >
                {notes === '' ? 'Set a note' : 'Change notes'}
              </Button>
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default SetDagTaskNotes;
