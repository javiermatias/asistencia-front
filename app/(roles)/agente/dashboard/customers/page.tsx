'use client'

import { useState } from "react";
import 'rsuite/dist/rsuite.min.css';
import { Steps, Panel, Placeholder, ButtonGroup, Button } from 'rsuite';
import { useSearchParams } from "next/navigation";
import Step from "@/app/ui/steps";



export default function Page() {
  const searchParams = useSearchParams()

  const numbStep = Number.parseInt(searchParams.get('id') || '0')
  //console.log(numbStep);

  const [step, setStep] = useState(numbStep);

  // Define your step data (titles and descriptions)
  const stepsData = [
    { title: 'Datos Generales', description: 'Datos Generales' },
    { title: 'Datos del Despacho', description: 'Despacho' },
    { title: 'Participantes', description: 'Participantes' },
    { title: 'Entrevista Indicadores', description: 'Entrevista Indicadores' },
  ];
  // Calculate the range of steps to display based on the current step
  const startStep = Math.max(0, step - 1);
  const endStep = Math.min(stepsData.length - 1, step + 1);



  const onChange = (nextStep: number) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);


  return (
    <div>
      <Step id={numbStep}></Step>



      <hr />
      <Panel header={`Step: ${step + 1}`}>
        <Placeholder.Paragraph />
      </Panel>
      <hr />
      <ButtonGroup>
        <Button onClick={onPrevious} disabled={step === 0}>
          Atras
        </Button>
        <Button onClick={onNext} disabled={step === 3}>
          Siguiente
        </Button>
      </ButtonGroup>
    </div>
  );
}