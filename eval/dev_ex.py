"""
Developer Experience Evaluation - Quantitative Analysis Visualizations
Bachelor Thesis: Component Libraries for Project Business

Generates scientific visualizations for:
1. Lines of Code (Code Changes vs Code Additions) comparison
2. Time-to-implement comparison

Uses Purple-Teal color palette and German labels.

Author: Florian Kulig
"""

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import pandas as pd
from pathlib import Path

# Scientific color scheme (purple-teal)
COLORS = {
    "material_primary": "#603DB1",  # Deep purple
    "material_secondary": "#8B5CF6",  # Medium purple
    "spade_primary": "#0A758F",  # Teal
    "spade_secondary": "#06B6D4",  # Light teal
    "background": "#FAFAFA",  # Light gray background
    "text": "#1F2937",  # Dark gray text
    "grid": "#E5E7EB",  # Light grid
}

# Set style for scientific publications
plt.style.use("seaborn-v0_8-whitegrid")
sns.set_palette("husl")


def setup_matplotlib():
    """Configure matplotlib for scientific publication quality"""
    plt.rcParams.update(
        {
            "font.size": 12,
            "font.family": "sans-serif",
            "font.sans-serif": ["Arial", "DejaVu Sans", "Liberation Sans"],
            "figure.dpi": 300,
            "savefig.dpi": 300,
            "savefig.bbox": "tight",
            "savefig.pad_inches": 0.1,
            "axes.linewidth": 0.8,
            "axes.edgecolor": COLORS["text"],
            "axes.labelcolor": COLORS["text"],
            "text.color": COLORS["text"],
            "xtick.color": COLORS["text"],
            "ytick.color": COLORS["text"],
            "grid.color": COLORS["grid"],
            "grid.alpha": 0.7,
            "figure.facecolor": "white",
            "axes.facecolor": "white",
        }
    )


def create_test_data():
    """Generate test data for development and testing"""

    # Lines of Code data (aggregated from experiment)
    loc_data = {
        "Task": ["Button", "Input", "Dropdown"] * 4,
        "Library": [
            "Angular Material",
            "Angular Material",
            "Angular Material",
            "Spade",
            "Spade",
            "Spade",
        ]
        * 2,
        "Type": ["Code Changes"] * 6 + ["Code Additions"] * 6,
        "Lines": [
            # Angular Material - Code Changes
            45,
            72,
            156,
            # Spade - Code Changes
            12,
            18,
            34,
            # Angular Material - Code Additions
            8,
            15,
            28,
            # Spade - Code Additions
            25,
            41,
            67,
        ],
    }

    # Time-to-implement data (in minutes)
    time_data = {
        "Task": ["Button", "Input", "Dropdown"],
        "Angular Material": [28.5, 45.2, 78.4],
        "Spade": [12.3, 19.7, 31.8],
        "Angular Material Std": [5.2, 8.1, 12.3],
        "Spade Std": [2.1, 3.4, 6.7],
    }

    return pd.DataFrame(loc_data), pd.DataFrame(time_data)


def plot_lines_of_code(loc_df, output_dir):
    """Create stacked bar chart for Lines of Code comparison"""

    fig, ax = plt.subplots(figsize=(12, 8))

    # Prepare data for stacked bars
    tasks = ["Button", "Input", "Dropdown"]
    x_pos = np.arange(len(tasks))
    width = 0.35

    # Separate data by library and type
    material_changes = loc_df[
        (loc_df["Library"] == "Angular Material") & (loc_df["Type"] == "Code Changes")
    ]["Lines"].values
    material_additions = loc_df[
        (loc_df["Library"] == "Angular Material") & (loc_df["Type"] == "Code Additions")
    ]["Lines"].values

    spade_changes = loc_df[
        (loc_df["Library"] == "Spade") & (loc_df["Type"] == "Code Changes")
    ]["Lines"].values
    spade_additions = loc_df[
        (loc_df["Library"] == "Spade") & (loc_df["Type"] == "Code Additions")
    ]["Lines"].values

    # Create stacked bars
    # Angular Material (left bars)
    bars1_changes = ax.bar(
        x_pos - width / 2,
        material_changes,
        width,
        label="Angular Material - Code Changes",
        color=COLORS["material_primary"],
        alpha=0.8,
    )
    bars1_additions = ax.bar(
        x_pos - width / 2,
        material_additions,
        width,
        bottom=material_changes,
        label="Angular Material - Code Additions",
        color=COLORS["material_secondary"],
        alpha=0.8,
    )

    # Spade (right bars)
    bars2_changes = ax.bar(
        x_pos + width / 2,
        spade_changes,
        width,
        label="Spade - Code Changes",
        color=COLORS["spade_primary"],
        alpha=0.8,
    )
    bars2_additions = ax.bar(
        x_pos + width / 2,
        spade_additions,
        width,
        bottom=spade_changes,
        label="Spade - Code Additions",
        color=COLORS["spade_secondary"],
        alpha=0.8,
    )

    # Customize chart
    ax.set_xlabel("Implementierungsaufgabe", fontweight="bold", fontsize=14)
    ax.set_ylabel("Zeilen Code", fontweight="bold", fontsize=14)
    ax.set_title(
        "Zeilen Code Vergleich: Angular Material vs. Spade\n(Code Changes und Code Additions)",
        fontweight="bold",
        fontsize=16,
        pad=20,
    )

    ax.set_xticks(x_pos)
    ax.set_xticklabels(
        ["Aufgabe 1\n(Button)", "Aufgabe 2\n(Input)", "Aufgabe 3\n(Dropdown)"]
    )

    # Add value labels on bars
    def add_value_labels(bars, values, bottom=None):
        for i, (bar, value) in enumerate(zip(bars, values)):
            height = bar.get_height()
            y_pos = height / 2 if bottom is None else bottom[i] + height / 2
            ax.text(
                bar.get_x() + bar.get_width() / 2.0,
                y_pos,
                f"{int(value)}",
                ha="center",
                va="center",
                fontweight="bold",
                color="white",
                fontsize=10,
            )

    add_value_labels(bars1_changes, material_changes)
    add_value_labels(bars1_additions, material_additions, material_changes)
    add_value_labels(bars2_changes, spade_changes)
    add_value_labels(bars2_additions, spade_additions, spade_changes)

    # Add improvement percentages
    total_material = material_changes + material_additions
    total_spade = spade_changes + spade_additions
    improvements = (total_material - total_spade) / total_material * 100

    for i, improvement in enumerate(improvements):
        ax.annotate(
            f"-{improvement:.1f}%",
            xy=(x_pos[i], max(total_material[i], total_spade[i]) + 5),
            ha="center",
            va="bottom",
            fontweight="bold",
            color=COLORS["spade_primary"],
            fontsize=12,
        )

    ax.legend(loc="upper left", frameon=True, fancybox=True, shadow=True)
    ax.grid(True, alpha=0.3)
    max_height = max(max(total_material), max(total_spade))
    ax.set_ylim(0, max_height * 1.20)

    plt.tight_layout()
    plt.savefig(output_dir / "zeilen_code_vergleich.png", dpi=300)
    plt.savefig(output_dir / "zeilen_code_vergleich.pdf", dpi=300)
    print(f"✓ Zeilen Code Diagramm gespeichert in {output_dir}")

    return fig


def plot_time_to_implement(time_df, output_dir):
    """Create bar chart with error bars for time-to-implement comparison"""

    fig, ax = plt.subplots(figsize=(12, 8))

    tasks = time_df["Task"].values
    x_pos = np.arange(len(tasks))
    width = 0.35

    # Extract data
    material_times = time_df["Angular Material"].values
    spade_times = time_df["Spade"].values
    material_std = time_df["Angular Material Std"].values
    spade_std = time_df["Spade Std"].values

    # Create bars with error bars
    bars1 = ax.bar(
        x_pos - width / 2,
        material_times,
        width,
        yerr=material_std,
        capsize=5,
        label="Angular Material",
        color=COLORS["material_primary"],
        alpha=0.8,
        error_kw={"linewidth": 2, "ecolor": COLORS["text"]},
    )

    bars2 = ax.bar(
        x_pos + width / 2,
        spade_times,
        width,
        yerr=spade_std,
        capsize=5,
        label="Spade",
        color=COLORS["spade_primary"],
        alpha=0.8,
        error_kw={"linewidth": 2, "ecolor": COLORS["text"]},
    )

    # Customize chart
    ax.set_xlabel("Implementierungsaufgabe", fontweight="bold", fontsize=14)
    ax.set_ylabel("Implementierungszeit (Minuten)", fontweight="bold", fontsize=14)
    ax.set_title(
        "Implementierungszeit Vergleich: Angular Material vs. Spade\n(mit Standardabweichung)",
        fontweight="bold",
        fontsize=16,
        pad=20,
    )

    ax.set_xticks(x_pos)
    ax.set_xticklabels(
        ["Aufgabe 1\n(Button)", "Aufgabe 2\n(Input)", "Aufgabe 3\n(Dropdown)"]
    )

    # Add value labels on bars
    def add_time_labels(bars, values, std_devs):
        for bar, value, std in zip(bars, values, std_devs):
            height = bar.get_height()
            ax.text(
                bar.get_x() + bar.get_width() / 2.0,
                height + std + 1,
                f"{value:.1f}min",
                ha="center",
                va="bottom",
                fontweight="bold",
                fontsize=11,
            )

    add_time_labels(bars1, material_times, material_std)
    add_time_labels(bars2, spade_times, spade_std)

    # Add improvement percentages
    improvements = (material_times - spade_times) / material_times * 100

    for i, improvement in enumerate(improvements):
        max_height = max(
            material_times[i] + material_std[i], spade_times[i] + spade_std[i]
        )
        ax.annotate(
            f"-{improvement:.1f}%".replace(".", ","),
            xy=(x_pos[i], max_height + 6),
            ha="center",
            va="bottom",
            fontweight="bold",
            color=COLORS["spade_primary"],
            fontsize=12,
        )

    ax.legend(loc="upper left", frameon=True, fancybox=True, shadow=True)
    ax.grid(True, alpha=0.3, axis="y")

    # Set y-axis to start from 0
    ax.set_ylim(0, max(material_times + material_std) * 1.2)

    plt.tight_layout()
    plt.savefig(output_dir / "implementierungszeit_vergleich.png", dpi=300)
    plt.savefig(output_dir / "implementierungszeit_vergleich.pdf", dpi=300)
    print(f"✓ Implementierungszeit Diagramm gespeichert in {output_dir}")

    return fig


def create_summary_table(loc_df, time_df, output_dir):
    """Create a summary table with key metrics"""

    # Calculate improvements
    tasks = ["Button", "Input", "Dropdown"]

    summary_data = []
    for task in tasks:
        # LoC data
        material_loc = loc_df[
            (loc_df["Library"] == "Angular Material") & (loc_df["Task"] == task)
        ]["Lines"].sum()
        spade_loc = loc_df[(loc_df["Library"] == "Spade") & (loc_df["Task"] == task)][
            "Lines"
        ].sum()
        loc_improvement = (material_loc - spade_loc) / material_loc * 100

        # Time data
        material_time = time_df[time_df["Task"] == task]["Angular Material"].iloc[0]
        spade_time = time_df[time_df["Task"] == task]["Spade"].iloc[0]
        time_improvement = (material_time - spade_time) / material_time * 100

        summary_data.append(
            {
                "Aufgabe": task,
                "Angular Material LoC": material_loc,
                "Spade LoC": spade_loc,
                "LoC Verbesserung": f"{loc_improvement:.1f}%",
                "Angular Material Zeit": f"{material_time:.1f}min",
                "Spade Zeit": f"{spade_time:.1f}min",
                "Zeit Verbesserung": f"{time_improvement:.1f}%",
            }
        )

    summary_df = pd.DataFrame(summary_data)

    # Save as CSV for further analysis
    summary_df.to_csv(output_dir / "evaluation_zusammenfassung.csv", index=False)
    print(
        f"✓ Zusammenfassungstabelle gespeichert in {output_dir}/evaluation_zusammenfassung.csv"
    )

    return summary_df


def main():
    """Main function to generate all evaluation visualizations"""

    # Setup
    setup_matplotlib()

    # Create output directory
    output_dir = Path("output")
    output_dir.mkdir(parents=True, exist_ok=True)

    print("🔬 Generiere Developer Experience Evaluation Visualisierungen...")
    print("=" * 60)

    # Load or create test data
    loc_df, time_df = create_test_data()

    print("📊 Datenübersicht:")
    print(f"   Zeilen Code Einträge: {len(loc_df)}")
    print(f"   Implementierungszeit Einträge: {len(time_df)}")
    print()

    # Generate visualizations
    print("📈 Erstelle Visualisierungen...")

    # 1. Lines of Code comparison
    loc_fig = plot_lines_of_code(loc_df, output_dir)

    # 2. Time-to-implement comparison
    time_fig = plot_time_to_implement(time_df, output_dir)

    # 3. Summary table
    summary_df = create_summary_table(loc_df, time_df, output_dir)

    print()
    print("📋 Zusammenfassungsstatistiken:")
    print(summary_df.to_string(index=False))

    print()
    print("✅ Alle Visualisierungen erfolgreich generiert!")
    print(f"📁 Output Verzeichnis: {output_dir.absolute()}")
    print()
    print("Generierte Dateien:")
    print("  • zeilen_code_vergleich.png/.pdf")
    print("  • implementierungszeit_vergleich.png/.pdf")
    print("  • evaluation_zusammenfassung.csv")

    # Show plots
    # plt.show()


if __name__ == "__main__":
    main()
