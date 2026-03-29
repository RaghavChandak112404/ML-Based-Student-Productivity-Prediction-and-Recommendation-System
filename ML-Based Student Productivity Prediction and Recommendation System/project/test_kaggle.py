import kagglehub
from kagglehub import KaggleDatasetAdapter
import sys

try:
    file_path = "student-productivity-and-digital-distraction-dataset.csv"
    df = kagglehub.load_dataset(
        KaggleDatasetAdapter.PANDAS,
        "sehaj1104/student-productivity-and-digital-distraction-dataset",
        file_path,
    )
    print("Columns:", list(df.columns))
    print("First 5 records:\n", df.head())
    
    # Let's see some basic info too
    print("\nCategorical columns unique values:")
    for col in df.select_dtypes(include=['object']).columns:
        print(f"{col}: {df[col].unique()}")
        
except Exception as e:
    print(f"Failed to load dataset: {e}")
    sys.exit(1)
