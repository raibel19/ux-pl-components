import { Input as InputLib } from '@/components/Input';
import { Information } from '@carbon/icons-react';
export default function Input() {
  return (
    <div>
      <InputLib
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
        onChange={async ({ item }) => {
          const { value } = item;
          console.log('onChange', item);
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
  );
}
