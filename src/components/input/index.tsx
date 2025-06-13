import { Information } from '@carbon/icons-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { getLocale, localeToCurrency } from 'ux-pl/utils/numbers';

export default function InputsExamples() {
  const [resetInputState, setResetInputState] = useState(false);
  const [controlerValueState, setControlerValueState] = useState('Mi Texto Controlado');

  useEffect(() => {
    if (resetInputState) {
      setTimeout(() => {
        setResetInputState(false);
      }, 200);
    }
  }, [resetInputState]);

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-y-5">
        <div className="flex gap-3">
          <Input
            setDefaultValueInReset={true}
            reset={resetInputState}
            nativeInputsProps={{ defaultValue: 'Mi texto' }}
            rightElement={{ clear: { id: 'clearInput1', show: true } }}
          />
          <button className="w-fit text-nowrap border p-2 text-xs" onClick={() => setResetInputState(true)}>
            Reset Input
          </button>
        </div>
        <div className="flex gap-3">
          <Input
            setDefaultValueInReset={true}
            reset={resetInputState}
            nativeInputsProps={{ value: controlerValueState }}
            rightElement={{ clear: { id: 'clearInput1', show: true } }}
            onChange={({ value }) => {
              setControlerValueState(value ?? '');
            }}
          />
          <button className="w-fit text-nowrap border p-2 text-xs" onClick={() => setResetInputState(true)}>
            Reset Input
          </button>
        </div>
        <div className="flex gap-3">
          <ExampleValidationsNumberLimits />
        </div>
        <div>
          <Input
            classNamePrincipalContainer="w-full"
            showTextLabel={true}
            // textLabel=""
            showRequired={true}
            showTextRequired={true}
            textRequired="REQUERIDO"
            leftElement={{
              id: 'searchBtnId',
              show: true,
              type: 'button',
              tooltipContent: 'Buscar',
              onClick: ({ item }) => {
                console.log('Search Onclick', { item });
              },
            }}
            rightElement={{
              elements: [
                {
                  id: 'btnId',
                  type: 'button',
                  show: true,
                  tooltipContent: <p>Tooltip Information</p>,
                  // onClick: rightFnc,
                },
                {
                  id: 'iconId',
                  type: 'icon',
                  show: true,
                  icon: <Information size={18} strokeWidth={2} aria-hidden="true" />,
                  hoverContent: (
                    <div className="flex flex-col justify-between space-x-4 space-y-1">
                      <div className="text-center font-semibold">Hover Information</div>
                      <div className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non eros fringilla, tempor velit a,
                        viverra risus. Proin fermentum consequat varius. Donec mollis cursus felis, non lobortis lacus
                        varius et.
                      </div>
                      <div className="text-sm text-muted-foreground">Footer</div>
                    </div>
                  ),
                },
                {
                  id: 'textId',
                  type: 'text',
                  show: true,
                  text: 'MXN',
                  separator: true,
                },
              ],
              clear: {
                id: 'clearId',
                show: true,
                tooltipContent: 'limpiar',
              },
              error: {
                id: 'errorId',
                show: true,
                tooltipContent: 'Error!!',
              },
              // counter: {
              //   show: true,
              // },
            }}
            nativeInputsProps={{
              placeholder: 'Buscar código del materialsa',
              // onKeyDown: handlerOnKeyDown,
              // onKeyUp: handlerOnKeyDown,
              // type: 'number',
              // defaultValue: '24',
              // value: '243',
              // value: valueController,
              // type: 'number',
              // defaultValue: 234.34,
              id: 'inputIds',
            }}
            // // data={1}
            onChange={async ({ value }) => {
              console.log('onChange', value);
              const currentValue = value || '';
              // if (currentValue.length >= 5) {
              //   setMaterialState(currentValue);
              // } else {
              //   setMaterialState(undefined);
              //   setIsLoading(false);
              // }
              // setValueController(currentValue);
            }}
            // waitTime={500}
            showSkeleton={true}
            // setDefaultValueInReset={true}
            validations={{
              // showError: !valueController,
              showError: false,
              errorMessages: { custom: 'Mensaje Error Dinamico' },
              maxLength: 100,
            }}
            sanitize={{ maxDecimalDigits: 4 }}
            formatter={{
              options: {
                style: 'currency',
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
                currencyDisplay: 'narrowSymbol',
                currencySign: 'standard',
                currency: 'JPY',
                // currencySign: 'standard',
              },
              roundDecimals: false,
            }}
            // waitTime={0}
          />
        </div>
      </div>
    </>
  );
}

export function ExampleValidationsNumberLimits() {
  return (
    <>
      <Input
        nativeInputsProps={{ type: 'number' }}
        rightElement={{ clear: { id: 'clearInput1', show: true } }}
        validations={{
          number: { limits: { min: 15, max: 90, reset: true, showError: true } },
          errorMessages: {
            limitsMin: 'El valor es menor al mínimo permitido',
            limitsMax: 'El valor es mayor al máximo permitido',
          },
        }}
      />
    </>
  );
}
