import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Programme } from '../../../shared/types';
import {
  handleFilterChange,
  handleModuleTypeFilterChange,
  handleOnDragEnd,
  handleSaveAllProgrammes,
  handleSearch,
  handleSearchChange,
  fetchData,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard/ModuleCard';
import './ProgrammeDesigner.css';
import SearchBar from './ModuleFilters/SearchBar/SearchBar';
import { useModuleActions } from '../../../utils/admin/ProgrammeDesigner';
import { ModuleInstance } from '../../../types/admin/ProgrammeDesigner';
import { Button } from '@chakra-ui/react';
import ModuleYearFilter from './ModuleFilters/YearFilter/YearFilter';
import ModuleTypeFilter from './ModuleFilters/TypeFilter/TypeFilter';
import { ModuleDocument } from '../../../types/admin/CreateModule';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>([]);
  const [searchResults, setSearchResults] = useState<ModuleDocument[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
    null,
  );
  // const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  // const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);

  useEffect(() => {
    fetchData(setProgrammeState, setSearchResults, setModuleInstances);
  }, []);

  const { handleEditModule } = useModuleActions(
    moduleInstances,
    setModuleInstances,
    programmeState,
    setProgrammeState,
  );

  return (
    <div className="programme-designer">
      <div className="search-bar-container">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(event) =>
            handleSearchChange(
              event,
              setSearchQuery,
              (results) => handleSearch(results, setSearchResults),
              searchResults,
              selectedYear,
              selectedModuleType,
            )
          }
          onSearch={(results) => handleSearch(results, setSearchResults)}
        />
      </div>
      <div className="filter-buttons-container">
        <ModuleYearFilter
          onFilterChange={(yearString: string | null) => {
            const year = yearString !== null ? parseInt(yearString, 10) : null;
            handleFilterChange(year, setSelectedYear);
          }}
          selectedYear={selectedYear}
        />
        <ModuleTypeFilter
          onFilterChange={(moduleType) =>
            handleModuleTypeFilterChange(moduleType, setSelectedModuleType)
          }
          selectedModuleType={selectedModuleType}
        />
        {/* <Button
          colorScheme="blue"
          onClick={() =>
            openAddModuleModal(
              setModalMode,
              setSelectedModule,
              setIsModuleModalOpen,
            )
          }
        >
          Add Module
        </Button> */}
      </div>
      <DragDropContext
        onDragEnd={(result: DropResult) =>
          handleOnDragEnd(
            result,
            moduleInstances,
            setModuleInstances,
            searchResults,
            setSearchResults,
            programmeState,
            setProgrammeState,
          )
        }
      >
        <div className="programme-container">
          {programmeState.map((programme) => (
            <Droppable droppableId={programme.id} key={programme.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="programme-box"
                >
                  <h2 className="programme-name">{programme.name}</h2>
                  <div className="module-list-container">
                    {moduleInstances
                      .filter(
                        (mi) =>
                          mi.programmeId === programme.id &&
                          (!selectedYear ||
                            mi.module.moduleSetup.studyYear === selectedYear) &&
                          (!selectedModuleType ||
                            mi.module.moduleSetup.type ===
                              selectedModuleType) &&
                          (searchQuery === '' ||
                            mi.module.moduleSetup.moduleTitle
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            mi.module.moduleSetup.moduleCode
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())),
                      )
                      .map((mi, index) => (
                        <Draggable
                          key={mi.uniqueId}
                          draggableId={mi.uniqueId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="module-item"
                            >
                              <ModuleList
                                modules={[mi.module]}
                                programmeId={programme.id}
                                moduleInstances={moduleInstances}
                                setModuleInstances={setModuleInstances}
                                programmeState={programmeState}
                                setProgrammeState={setProgrammeState}
                                onEdit={() => handleEditModule(mi)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="save-button-container">
        <Button
          colorScheme="blue"
          onClick={(event) => handleSaveAllProgrammes(event, programmeState)}
          className="save-programme-button"
        >
          Save All Programmes
        </Button>
      </div>
      {/* {isModuleModalOpen && (
        <ModuleForm
          mode={modalMode}
          module={selectedModule}
          onClose={() => closeModuleModal(setIsModuleModalOpen)}
          onSubmit={handleSubmit}
          moduleInstances={moduleInstances}
          setModuleInstances={setModuleInstances}
          programmeState={programmeState}
          setProgrammeState={setProgrammeState}
        />
      )} */}
    </div>
  );
}

export default ProgrammeDesigner;

// import { useEffect, useState } from 'react';
// import { Module, Programme } from '../../../shared/types';
// import {
//   handleFilterChange,
//   handleModuleTypeFilterChange,
//   handleSaveAllProgrammes,
//   handleSearch,
//   handleSearchChange,
//   openAddModuleModal,
//   closeModuleModal,
//   fetchData,
// } from '../../../utils/admin/ProgrammeDesigner';
// import ModuleList from './ModuleCard/ModuleCard';
// import './ProgrammeDesigner.css';
// import { Button as MuiButton } from '@mui/material';
// import ModuleFilterButtons from './Buttons/ModuleFilterButtons';
// import SearchBar from './SearchBar/SearchBar';
// import ModuleTypeFilterButtons from './Buttons/ModuleTypeFilterButtons';
// import ModuleForm from './ModuleForm/ModuleForm';
// import { useModuleActions } from '../../../utils/admin/ProgrammeDesigner';
// import { ModuleInstance } from '../../../types/admin/ProgrammeDesigner';
// import { Box, Tabs, Tab } from '@mui/material';

// function ProgrammeDesigner() {
//   const [programmeState, setProgrammeState] = useState<Programme[]>([]);
//   const [searchResults, setSearchResults] = useState<Module[]>([]);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
//     null,
//   );
//   const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
//   const [selectedModule, setSelectedModule] = useState<Module | undefined>(
//     undefined,
//   );
//   const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);
//   const [selectedProgramme, setSelectedProgramme] = useState<string | null>(
//     null,
//   );

//   useEffect(() => {
//     fetchData(setProgrammeState, setSearchResults, setModuleInstances);
//   }, []);

//   const { handleEditModule, handleSubmit } = useModuleActions(
//     moduleInstances,
//     setModuleInstances,
//     programmeState,
//     setProgrammeState,
//   );

//   const handleProgrammeChange = (
//     event: React.SyntheticEvent,
//     newValue: string,
//   ) => {
//     setSelectedProgramme(newValue);
//   };

//   const filteredModuleInstances = moduleInstances.filter(
//     (mi) =>
//       (!selectedProgramme || mi.programmeId === selectedProgramme) &&
//       (!selectedYear || mi.module.year === selectedYear) &&
//       (!selectedModuleType || mi.module.type === selectedModuleType) &&
//       (searchQuery === '' ||
//         mi.module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         mi.module.id.toLowerCase().includes(searchQuery.toLowerCase())),
//   );

//   return (
//     <div className="programme-designer">
//       <div className="search-bar-container">
//         <SearchBar
//           searchQuery={searchQuery}
//           onSearchChange={(event) =>
//             handleSearchChange(
//               event,
//               setSearchQuery,
//               (results) => handleSearch(results, setSearchResults),
//               searchResults,
//               selectedYear,
//               selectedModuleType,
//             )
//           }
//           onSearch={(results) => handleSearch(results, setSearchResults)}
//         />
//       </div>
//       <div className="filter-buttons-container">
//         <ModuleFilterButtons
//           onFilterChange={(year) => handleFilterChange(year, setSelectedYear)}
//           selectedYear={selectedYear}
//         />
//         <ModuleTypeFilterButtons
//           onFilterChange={(moduleType) =>
//             handleModuleTypeFilterChange(moduleType, setSelectedModuleType)
//           }
//           selectedModuleType={selectedModuleType}
//         />
//         <MuiButton
//           variant="contained"
//           color="primary"
//           onClick={() =>
//             openAddModuleModal(
//               setModalMode,
//               setSelectedModule,
//               setIsModuleModalOpen,
//             )
//           }
//         >
//           Add Module
//         </MuiButton>
//       </div>
//       <div className="module-container">
//         <Tabs
//           value={selectedProgramme || false}
//           onChange={handleProgrammeChange}
//           indicatorColor="primary"
//           textColor="primary"
//           variant="fullWidth"
//           centered
//           className="module-tabs"
//         >
//           <Tab label="All" value={null} />
//           {programmeState.map((programme) => (
//             <Tab
//               key={programme.id}
//               label={programme.name}
//               value={programme.id}
//             />
//           ))}
//         </Tabs>
//         <div className="module-list-container">
//           {filteredModuleInstances.map((mi) => (
//             <div key={mi.uniqueId} className="module-item">
//               <ModuleList
//                 modules={[mi.module]}
//                 programmeId={mi.programmeId}
//                 onEdit={() =>
//                   handleEditModule(
//                     mi,
//                     setModalMode,
//                     setSelectedModule,
//                     setIsModuleModalOpen,
//                   )
//                 }
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="save-button-container">
//         <MuiButton
//           variant="contained"
//           color="primary"
//           onClick={(event) => handleSaveAllProgrammes(event, programmeState)}
//           className="save-programme-button"
//         >
//           Save All Programmes
//         </MuiButton>
//       </div>
//       {isModuleModalOpen && (
//         <ModuleForm
//           mode={modalMode}
//           module={selectedModule}
//           onClose={() => closeModuleModal(setIsModuleModalOpen)}
//           onSubmit={handleSubmit}
//           moduleInstances={moduleInstances}
//           setModuleInstances={setModuleInstances}
//           programmeState={programmeState}
//           setProgrammeState={setProgrammeState}
//         />
//       )}
//     </div>
//   );
// }

// export default ProgrammeDesigner;
