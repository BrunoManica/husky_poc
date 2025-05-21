import React, { FC } from 'react';
import { EmptyState, Button } from 'vtex.styleguide';

interface ErrorComponentProps {
  resetStates: () => void;
}

const ErrorComponent: FC<ErrorComponentProps> = ({ resetStates }) => (
  <EmptyState title="Erro ao consultar o Produto">
    <p>Produto não encontrado, por favor insira o ID de Materia FSJ e tente novamente.</p>
    <div className="pt5">
      <Button onClick={resetStates} variation="secondary" size="small">
        Tentar Novamente
      </Button>
    </div>
  </EmptyState>
);

export default ErrorComponent;
