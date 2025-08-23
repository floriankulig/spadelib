import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import pandas as pd
from scipy.stats import pearsonr, spearmanr
from scipy import stats

# Set scientific plotting style
plt.style.use("seaborn-v0_8-whitegrid")
sns.set_palette("Set2")


# Example data structure based on your experiment design
# Replace with your actual data loading
def load_completion_data():
    """
    Load completion rate data from experiment results.
    Replace this with your actual data loading logic.
    """
    # Simulated realistic data based on your experiment context
    np.random.seed(42)  # For reproducible results

    participants = []
    tasks = ["Button", "Input", "Dropdown"]
    task_complexity = {"Button": 1, "Input": 2, "Dropdown": 3}  # Complexity scaling
    experience_groups = ["Studenten", "Junior", "Mid-Level", "Senior"]
    experience_years = [0, 1.5, 4, 7]  # Average years per group

    # Generate realistic completion rates
    participant_id = 1
    for exp_idx, (exp_group, years) in enumerate(
        zip(experience_groups, experience_years)
    ):
        # Number of participants per group (adjust to your actual data)
        n_participants = [2, 5, 3, 2][exp_idx]  # From your participants.py

        for p in range(n_participants):
            for task in tasks:
                complexity = task_complexity[task]

                # Angular Material modeling:
                # Base completion rate that improves with experience
                material_base = 70 + years * 3.5  # Strong experience effect

                # Task complexity penalty (harder tasks = lower completion)
                complexity_penalty_material = (complexity - 1) * 8

                # Experience reduces complexity penalty (experienced devs handle complexity better)
                experience_bonus = min(years * 2, 8)  # Cap at 10% bonus

                material_completion = (
                    material_base - complexity_penalty_material + experience_bonus
                )

                # Add realistic variance
                material_completion = np.clip(
                    np.random.normal(material_completion, 8), 45, 100
                )

                # Spade modeling:
                # Generally better baseline, especially for complex tasks
                spade_base = 80 + years * 2  # Moderate experience effect

                # Spade advantage increases with task complexity (this is its strength)
                spade_complexity_bonus = (
                    complexity - 1
                ) * 4  # Less penalty, more bonus

                # For experienced developers and simple tasks, advantage diminishes
                if years >= 4 and complexity == 1:  # Senior/Mid-Level + Button task
                    experience_convergence = years * 2  # Convergence effect
                    spade_advantage_reduction = min(experience_convergence, 12)
                else:
                    spade_advantage_reduction = 0

                spade_completion = (
                    spade_base - spade_complexity_bonus - spade_advantage_reduction
                )

                # Add realistic variance (Spade more consistent)
                spade_completion = np.clip(
                    np.random.normal(spade_completion, 6), 55, 100
                )

                # Ensure Spade is generally better (with some realistic exceptions)
                if np.random.random() > 0.9:  # 12% chance of Material being better
                    pass  # Keep original values
                else:
                    # Ensure Spade advantage, but realistic
                    min_spade_advantage = 2 if complexity > 1 else 0
                    if spade_completion < material_completion + min_spade_advantage:
                        spade_completion = (
                            material_completion
                            + min_spade_advantage
                            + np.random.uniform(0, 5)
                        )
                        spade_completion = min(spade_completion, 100)

                participants.append(
                    {
                        "participant_id": participant_id,
                        "experience_group": exp_group,
                        "experience_years": years,
                        "task": task,
                        "task_complexity": complexity,
                        "material_completion": material_completion,
                        "spade_completion": spade_completion,
                    }
                )
            participant_id += 1

    return pd.DataFrame(participants)


def create_completion_rate_visualization(df):
    """Create comprehensive completion rate visualization"""

    # Define task order by complexity (simple to complex)
    task_order = ["Button", "Input", "Dropdown"]

    # Calculate average completion rates by task and approach
    avg_completion = df.groupby("task")[
        ["material_completion", "spade_completion"]
    ].mean()

    # Sort by complexity
    avg_completion = avg_completion.reindex(task_order)

    # Create figure with subplots
    fig = plt.figure(figsize=(16, 10))

    # Subplot 1: Average completion rates by task
    ax1 = plt.subplot(2, 3, (1, 2))

    tasks = avg_completion.index
    x = np.arange(len(tasks))
    width = 0.35

    bars1 = ax1.bar(
        x - width / 2,
        avg_completion["material_completion"],
        width,
        label="Angular Material",
        color="#603DB1",
        alpha=0.8,
        edgecolor="black",
        linewidth=1.2,
    )
    bars2 = ax1.bar(
        x + width / 2,
        avg_completion["spade_completion"],
        width,
        label="Spade",
        color="#06667E",
        alpha=0.8,
        edgecolor="black",
        linewidth=1.2,
    )

    # Add value labels on bars
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax1.text(
                bar.get_x() + bar.get_width() / 2.0,
                height + 1,
                f"{height:.1f}%",
                ha="center",
                va="bottom",
                fontweight="bold",
                fontsize=10,
            )

    ax1.set_xlabel("Task", fontweight="bold", fontsize=12)
    ax1.set_ylabel(
        "Durchschnittliche Erfüllungsrate (%)", fontweight="bold", fontsize=12
    )
    ax1.set_title(
        "Erfüllungsraten nach Task und Ansatz (n=12)",
        fontweight="bold",
        fontsize=14,
        pad=20,
    )
    ax1.set_xticks(x)
    ax1.set_xticklabels(tasks)
    ax1.legend(loc="upper right", frameon=True, fancybox=True, shadow=True)
    ax1.set_ylim(0, 120)
    ax1.grid(axis="y", alpha=0.3)

    # Subplot 2: Overall comparison
    ax2 = plt.subplot(2, 3, 3)

    overall_material = df["material_completion"].mean()
    overall_spade = df["spade_completion"].mean()

    bars = ax2.bar(
        ["Angular\nMaterial", "Spade"],
        [overall_material, overall_spade],
        color=["#603DB1", "#06667E"],
        alpha=0.8,
        edgecolor="black",
        linewidth=1.2,
    )

    # Add value labels
    for bar, value in zip(bars, [overall_material, overall_spade]):
        height = bar.get_height()
        ax2.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + 1,
            f"{value:.1f}%",
            ha="center",
            va="bottom",
            fontweight="bold",
            fontsize=12,
        )

    ax2.set_ylabel("Erfüllungsrate (%)", fontweight="bold", fontsize=12)
    ax2.set_title("Gesamtvergleich", fontweight="bold", fontsize=12)
    ax2.set_ylim(0, 105)
    ax2.grid(axis="y", alpha=0.3)

    return fig, (ax1, ax2)


def create_experience_correlation_analysis(df):
    """Create correlation analysis between experience and completion rates"""

    # Prepare data for correlation analysis
    # Average completion rates per participant
    participant_data = (
        df.groupby(["participant_id", "experience_years"])
        .agg({"material_completion": "mean", "spade_completion": "mean"})
        .reset_index()
    )

    # Create correlation subplot
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # Correlation for Angular Material
    ax1 = axes[0]
    x_material = participant_data["experience_years"]
    y_material = participant_data["material_completion"]

    # Calculate correlation
    r_material, p_material = pearsonr(x_material, y_material)

    # Scatter plot with trend line
    ax1.scatter(
        x_material,
        y_material,
        color="#603DB1",
        alpha=0.7,
        s=80,
        edgecolors="black",
        linewidth=1,
    )

    # Add trend line
    z = np.polyfit(x_material, y_material, 1)
    p = np.poly1d(z)
    ax1.plot(
        x_material,
        p(x_material),
        color="#8B5CF6",
        linewidth=2,
        linestyle="--",
        alpha=0.8,
    )

    ax1.set_xlabel("Berufserfahrung (Jahre)", fontweight="bold", fontsize=12)
    ax1.set_ylabel("Erfüllungsrate (%)", fontweight="bold", fontsize=12)
    ax1.set_title(
        f"Angular Material\nr = {r_material:.3f}, p = {p_material:.3f}",
        fontweight="bold",
        fontsize=12,
    )
    ax1.grid(True, alpha=0.3)
    ax1.set_ylim(40, 105)

    # Correlation for Spade
    ax2 = axes[1]
    x_spade = participant_data["experience_years"]
    y_spade = participant_data["spade_completion"]

    # Calculate correlation
    r_spade, p_spade = pearsonr(x_spade, y_spade)

    # Scatter plot with trend line
    ax2.scatter(
        x_spade,
        y_spade,
        color="#06667E",
        alpha=0.7,
        s=80,
        edgecolors="black",
        linewidth=1,
    )

    # Add trend line
    z = np.polyfit(x_spade, y_spade, 1)
    p_trend = np.poly1d(z)
    ax2.plot(
        x_spade,
        p_trend(x_spade),
        color="#078CA3",
        linewidth=2,
        linestyle="--",
        alpha=0.8,
    )

    ax2.set_xlabel("Berufserfahrung (Jahre)", fontweight="bold", fontsize=12)
    ax2.set_ylabel("Erfüllungsrate (%)", fontweight="bold", fontsize=12)
    ax2.set_title(
        f"Spade\nr = {r_spade:.3f}, p = {p_spade:.3f}", fontweight="bold", fontsize=12
    )
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(40, 105)

    plt.tight_layout()

    # Print statistical summary
    print("Korrelationsanalyse: Erfahrung vs. Erfüllungsrate")
    print("=" * 55)
    print(f"Angular Material: r = {r_material:.3f}, p = {p_material:.3f}")
    print(f"Spade:           r = {r_spade:.3f}, p = {p_spade:.3f}")
    print()

    # Interpretation
    significance_level = 0.05
    print("Interpretation:")
    if p_material < significance_level:
        print(
            f"- Angular Material: Signifikante Korrelation (p < {significance_level})"
        )
    else:
        print(
            f"- Angular Material: Keine signifikante Korrelation (p ≥ {significance_level})"
        )

    if p_spade < significance_level:
        print(f"- Spade: Signifikante Korrelation (p < {significance_level})")
    else:
        print(f"- Spade: Keine signifikante Korrelation (p ≥ {significance_level})")

    return fig, (r_material, p_material, r_spade, p_spade)


def create_experience_group_comparison(df):
    """Compare completion rates across experience groups"""

    # Define experience group order by years of experience
    experience_order = ["Studenten", "Junior", "Mid-Level", "Senior"]

    # Calculate average completion rates by experience group
    exp_comparison = df.groupby("experience_group")[
        ["material_completion", "spade_completion"]
    ].agg(["mean", "std"])

    # Sort by experience level (YoE)
    exp_comparison = exp_comparison.reindex(experience_order)

    fig, ax = plt.subplots(1, 1, figsize=(12, 6))

    experience_groups = exp_comparison.index
    x = np.arange(len(experience_groups))
    width = 0.35

    # Material bars
    material_means = exp_comparison[("material_completion", "mean")]
    material_stds = exp_comparison[("material_completion", "std")]

    bars1 = ax.bar(
        x - width / 2,
        material_means,
        width,
        yerr=material_stds,
        capsize=5,
        label="Angular Material",
        color="#603DB1",
        alpha=0.8,
        edgecolor="black",
        linewidth=1.2,
    )

    # Spade bars
    spade_means = exp_comparison[("spade_completion", "mean")]
    spade_stds = exp_comparison[("spade_completion", "std")]

    bars2 = ax.bar(
        x + width / 2,
        spade_means,
        width,
        yerr=spade_stds,
        capsize=5,
        label="Spade",
        color="#06667E",
        alpha=0.8,
        edgecolor="black",
        linewidth=1.2,
    )

    # Add value labels
    for bars, means in [(bars1, material_means), (bars2, spade_means)]:
        for bar, mean in zip(bars, means):
            height = bar.get_height()
            ax.text(
                bar.get_x() + bar.get_width() / 2.0,
                height / 2,
                f"{mean:.1f}%",
                ha="center",
                va="bottom",
                fontweight="bold",
                color="#fff",
                fontsize=10,
            )

    ax.set_xlabel("Erfahrungsgruppe", fontweight="bold", fontsize=12)
    ax.set_ylabel("Erfüllungsrate (%) ± SD", fontweight="bold", fontsize=12)
    ax.set_title(
        "Erfüllungsraten nach Erfahrungsgruppe", fontweight="bold", fontsize=14, pad=20
    )
    ax.set_xticks(x)
    ax.set_xticklabels(experience_groups)
    ax.legend(loc="upper left", frameon=True, fancybox=True, shadow=True)
    ax.set_ylim(0, 105)
    ax.grid(axis="y", alpha=0.3)

    plt.tight_layout()
    return fig


def main():
    """Main execution function"""

    # Load data (replace with your actual data loading)
    df = load_completion_data()

    # Create completion rate visualization
    print("Erstelle Erfüllungsrate Visualisierung...")
    fig1, axes1 = create_completion_rate_visualization(df)
    plt.savefig(
        "output/completion_rates_overview.png",
        dpi=300,
        bbox_inches="tight",
        facecolor="white",
        edgecolor="none",
    )

    # Create correlation analysis
    print("Führe Korrelationsanalyse durch...")
    fig2, correlation_results = create_experience_correlation_analysis(df)
    plt.savefig(
        "output/experience_completion_correlation.png",
        dpi=300,
        bbox_inches="tight",
        facecolor="white",
        edgecolor="none",
    )

    # Create experience group comparison
    print("Erstelle Erfahrungsgruppen-Vergleich...")
    fig3 = create_experience_group_comparison(df)
    plt.savefig(
        "output/experience_group_comparison.png",
        dpi=300,
        bbox_inches="tight",
        facecolor="white",
        edgecolor="none",
    )

    # Statistical summary
    print("\nStatistische Zusammenfassung:")
    print("=" * 40)

    overall_stats = df[["material_completion", "spade_completion"]].describe()
    print("\nDeskriptive Statistik:")
    print(overall_stats.round(2))

    # Paired t-test for completion rates
    from scipy.stats import ttest_rel

    # Average completion rates per participant
    participant_avg = df.groupby("participant_id")[
        ["material_completion", "spade_completion"]
    ].mean()

    t_stat, t_p = ttest_rel(
        participant_avg["material_completion"], participant_avg["spade_completion"]
    )

    print(f"\nPaired t-Test (Material vs. Spade):")
    print(f"t = {t_stat:.3f}, p = {t_p:.3f}")

    if t_p < 0.05:
        print("Signifikanter Unterschied zwischen den Ansätzen (p < 0.05)")
    else:
        print("Kein signifikanter Unterschied zwischen den Ansätzen (p ≥ 0.05)")

    print("\nVisualisierungen gespeichert in:")
    print("- output/completion_rates_overview.png")
    print("- output/experience_completion_correlation.png")
    print("- output/experience_group_comparison.png")


if __name__ == "__main__":
    main()
