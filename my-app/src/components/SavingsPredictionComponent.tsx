interface SavingsPredictionProps {
  savings: number;
}

const SavingsPrediction = ({ savings }: SavingsPredictionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Savings Prediction</h3>
      <p>
        Your savings for the next month are estimated to be around ${savings}.
      </p>
    </div>
  );
};

export default SavingsPrediction;
