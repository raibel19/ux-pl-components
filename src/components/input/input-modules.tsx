import { ActionDefinition, Code, Settings } from '@carbon/icons-react';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/compositions/input';

import AutocompleteTestBed from './autocomplete-prueba';

export default function InputModules() {
  const [controllerValue, setControllerValue] = useState<string>('123456');
  const [isLoadig, setIsLoadig] = useState(true);
  const leftAddonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      // setReset(true);
      setIsLoadig(false);
      setTimeout(() => {
        console.log('left addon ref.', leftAddonRef.current);
      }, 100);
    }, 2000);
  }, []);

  const hoverContent = (
    <div className="flex justify-between gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@nextjs</h4>
        <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
        <div className="text-xs text-muted-foreground">Joined December 2021</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-y-5">
      <div className="flex gap-3">
        <Input
          type="number"
          defaultValue="7890"
          // value={controllerValue}
          data={[1, 2, 3]}
          // disabled={true}
          // isInvalid={true}
          textProcessor={{
            maxLength: 10,
            limits: {
              min: 10,
              //   max: 90,
              maxMessageError: 'Max error',
              minMessageError: 'Min error',
            },
            between: {
              min: 10,
              max: 90,
              //   messageError: 'Between',
            },
            formatter: {
              active: true,
              options: {
                style: 'currency',
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
                compactDisplay: 'long',
                currencySign: 'standard',
              },
            },
          }}
          subscribeIsInvalid={(isInvalid) => console.log('isInvalid: ', isInvalid)}
          //   reset={reset}
          //   setReset={setReset}
          //   resetToInitialValue={true}
          onValueChange={(item) => {
            console.log('onValueChange', item);
            setControllerValue(item.value);
          }}
        >
          {isLoadig ? (
            <Input.Skeleton />
          ) : (
            <>
              <Input.Content>
                <Input.Control />
                <Input.Label text="Input Modulos" isRequired={true} textRequired={'Required'} />
                <Input.LeftAddons ref={leftAddonRef}>
                  <Input.Addons.Icon
                    className="ps-3"
                    tooltipContent={<p>HOLLLLLLA</p>}
                    tooltipConfig={{ disableHoverableContent: true }}
                    show={true}
                  />
                  <Input.Addons.Separator />
                  <Input.Addons.Icon
                    hoverContent={hoverContent}
                    hoverConfig={{ openDelay: 100, onOpenChange: (open) => console.log('IS OPEN:', open) }}
                    icon={<Code />}
                  />
                  <Input.Addons.Separator />
                  <Input.Addons.Icon icon={<ActionDefinition />} />
                  <Input.Addons.Separator />
                  <Input.Addons.Text text="$MXN" />
                  <Input.Addons.Separator />
                  <Input.Addons.Button icon={<Settings />} hoverContent={hoverContent} />
                  <Input.Addons.Separator />
                  <Input.Addons.Button
                    text="click"
                    className="text-xs"
                    tooltipContent={<p>Da click</p>}
                    onClick={(item) => console.log(item)}
                  />
                </Input.LeftAddons>
                <Input.RightAddons>
                  <Input.Addons.Counter />
                  <Input.Addons.Error showAddonSeparatorLeft={true} />
                  <Input.Addons.Clear showAddonSeparatorLeft={true} tooltipContent={<p>Clear</p>} />
                </Input.RightAddons>
              </Input.Content>
              <Input.Errors customMessageError="Mi error" />
            </>
          )}
        </Input>
      </div>
      <div className="flex gap-3">
        <Input
          type="text"
          // value={controllerValue}
          data={[1, 2, 3]}
          //   reset={reset}
          //   setReset={setReset}
          //   resetToInitialValue={true}
          onValueChange={(item) => {
            console.log('onValueChange', item);
            setControllerValue(item.value);
          }}
        >
          {isLoadig ? (
            <Input.Skeleton />
          ) : (
            <>
              <Input.Content>
                <Input.Control />
                <Input.Label text="Input Modulos" isRequired={true} textRequired={'Required'} />
                <Input.LeftAddons ref={leftAddonRef}>
                  <Input.Addons.Icon
                    className="ps-3"
                    tooltipContent={<p>HOLLLLLLA</p>}
                    tooltipConfig={{ disableHoverableContent: true }}
                    show={true}
                  />
                  <Input.Addons.Separator />
                  <Input.Addons.Icon
                    hoverContent={hoverContent}
                    hoverConfig={{ openDelay: 100, onOpenChange: (open) => console.log('IS OPEN:', open) }}
                    icon={<Code />}
                  />
                  <Input.Addons.Separator />
                  <Input.Addons.Icon icon={<ActionDefinition />} />
                  <Input.Addons.Separator />
                  <Input.Addons.Text text="$MXN" />
                  <Input.Addons.Separator />
                  <Input.Addons.Button icon={<Settings />} hoverContent={hoverContent} />
                  <Input.Addons.Separator />
                  <Input.Addons.Button
                    text="click"
                    className="text-xs"
                    tooltipContent={<p>Da click</p>}
                    onClick={(item) => console.log(item)}
                  />
                </Input.LeftAddons>
                <Input.RightAddons>
                  <Input.Addons.Counter />
                  <Input.Addons.Error showAddonSeparatorLeft={true} />
                  <Input.Addons.Clear showAddonSeparatorLeft={true} tooltipContent={<p>Clear</p>} />
                </Input.RightAddons>
              </Input.Content>
              <Input.Errors customMessageError="Mi error" />
            </>
          )}
        </Input>
      </div>
      <div className="flex gap-3">
        <AutocompleteTestBed />
      </div>
    </div>
  );
}
