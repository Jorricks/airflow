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
  Text, useTheme,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { getMetaValue } from '../../../utils';
import { useSetDagRunNotes } from '../../../api';

const canEdit = getMetaValue('can_edit') === 'True';

const SetDagRunNotes = ({
  dagId, runId, initialValue, updateApiDataFunction,
}) => {
  const [notes, setNotes] = useState(initialValue == null ? '' : initialValue);
  const [noteBeforeEdit, setNoteBeforeEdit] = useState('');
  const [editMode, changeEditMode] = useState(false);
  const { mutateAsync: apiCallToSetNote, isLoading } = useSetDagRunNotes(dagId, runId, notes);

  const { colors } = useTheme();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiCallToSetNote();
    updateApiDataFunction(notes);
    changeEditMode(false);
  };

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem style={{ border: 0 }}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left" font>
              <Text fontSize="lg" color={colors.blue[600]} fontWeight="600">
                DAG Run Notes:
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div>
                <TextareaAutosize
                  minRows={1}
                  maxRows={10}
                  value={(notes === null) ? '' : notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Button type="submit" isLoading={isLoading}>
                  Update user notes
                </Button>
                <Button
                  onClick={() => { setNotes(noteBeforeEdit); changeEditMode(false); }}
                  isLoading={isLoading}
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
                isLoading={isLoading}
                isDisabled={!canEdit}
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

export default SetDagRunNotes;
