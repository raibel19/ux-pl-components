import { Checkbox, CheckboxChecked, ExecutableProgram } from '@carbon/icons-react';
import { useCallback, useMemo, useState } from 'react';

import { Autocomplete } from '../../../lib/components/compositions/autocomplete';

import { AutocompleteStateChangePayload, IItem } from '../../../lib/components/compositions/autocomplete/types/types';

// --- DATOS DE PRUEBA ---
const sampleItems: IItem[] = [
  {
    label: 'JavaScript',
    value: 'js',
    render: ({ item }) => <span className="font-bold italic">{item.label}</span>,
  },
  {
    label: 'JavaScript 2',
    value: 'js2',
    render: ({ children }) => (
      <div className="flex w-full items-center justify-between text-purple-500">
        {children}
        <ExecutableProgram />
      </div>
    ),
  },
  { label: 'JavaScript 2 -1', value: 'js3' },
  { label: 'JavaScript 2 -2', value: 'js3' },
  { label: 'Python', value: 'py' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'C++', value: 'cpp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Ruby', value: 'ruby', disabled: true },
  { label: 'PHP', value: 'php' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
];

interface MockApiOptions {
  term: string;
  latency?: number | 'random';
  forceError?: boolean;
  forceNoResults?: boolean;
}

const mockApiSearch = async (options: MockApiOptions): Promise<IItem[]> => {
  const { term, latency = 'random', forceError = false, forceNoResults = false } = options;
  console.log(`%cAPI: Buscando para "${term}"...`, 'color: blue');
  const delay = latency === 'random' ? Math.random() * 1200 + 300 : latency;
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (forceError) throw new Error('Error de servidor simulado');
  if (forceNoResults) return [];
  const results = sampleItems.filter((item) => item.label.toLowerCase().includes(term.toLowerCase()));
  console.log(`%cAPI: Respuesta para "${term}" encontrada con ${results.length} resultados.`, 'color: green');
  return results;
};

// --- BANCO DE PRUEBAS ---
export default function AutocompleteTestBed() {
  type FetchedData = { data: IItem[]; searchValue: string | null };
  const initialData: FetchedData = useMemo(() => ({ data: [], searchValue: null }), []);

  // Estados para cada escenario
  const [normalSearchData, setNormalSearchData] = useState<FetchedData>(initialData);
  const [normalSearchLoading, setNormalSearchLoading] = useState(false);

  // --- LÓGICA DE DATOS "REALISTA" ---
  // Un único handler que simula un desarrollador típico: recibe el input, llama a la API, y actualiza estados.
  const handleRealisticSearch = useCallback(
    async (
      payload: AutocompleteStateChangePayload<unknown>,
      setter: React.Dispatch<React.SetStateAction<FetchedData>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      options: Omit<MockApiOptions, 'term'> = {},
    ) => {
      // El desarrollador solo actúa si el input cambia y no está vacío
      if (payload.type === 'INPUT_CHANGE' || (payload.type === 'ITEM_SELECTED' && payload.inputValue)) {
        const searchTerm = payload.inputValue;
        setLoading(true);

        try {
          const results = await mockApiSearch({ term: searchTerm, ...options });
          // Importante: Pasa el `searchTerm` para que el componente Autocomplete pueda descartar resultados obsoletos.
          setter({ data: results, searchValue: searchTerm });
        } catch (error) {
          console.error(error);
          // Incluso en error, se informa al Autocomplete que la búsqueda para este término terminó.
          setter({ data: [], searchValue: searchTerm });
        } finally {
          setLoading(false);
        }
      } else if (payload.type === 'RESET' || payload.inputValue === '') {
        setter(initialData); // Resetea si el input se limpia
      }
    },
    [initialData],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <h1 className="mb-8 text-3xl font-bold text-slate-800">Banco de Pruebas para Autocomplete</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Escenario 1: Búsqueda Normal */}
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-700">1. Búsqueda Normal</h2>
          <p className="text-sm text-slate-500">
            Simula una búsqueda realista con latencia variable. El componente debe manejar la carrera de peticiones
            internamente.
          </p>
          <Autocomplete
            items={normalSearchData}
            loading={normalSearchLoading}
            onStateChange={(p) => handleRealisticSearch(p, setNormalSearchData, setNormalSearchLoading)}
          >
            <Autocomplete.Label
              text="Autocomplete Modulos"
              isRequired
              textRequired="- Requeido"
              classNameTextRequired="pl-1"
              classNameRequired="pl-1"
            />
            <Autocomplete.Group>
              <Autocomplete.InputWrapper>
                <Autocomplete.Input placeholder="Escribe un lenguaje..." />
              </Autocomplete.InputWrapper>
              <Autocomplete.Popover>
                <Autocomplete.Header>
                  <p>Lenguajes de Programación</p>
                </Autocomplete.Header>
                <Autocomplete.Messages />
                <Autocomplete.Loading />
                <Autocomplete.List>
                  {({ item, isSelected }) => (
                    <>
                      {isSelected ? <CheckboxChecked /> : <Checkbox />}
                      <span>{item.label}</span>
                    </>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popover>
            </Autocomplete.Group>
          </Autocomplete>
        </div>
      </div>
    </div>
  );
}
