import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

# Set scientific plotting style
plt.style.use("seaborn-v0_8-whitegrid")
sns.set_palette("Set2")

# Data for professional experience groups (n=12)
experience_groups = [
    "Studenten\n(0 Jahre)",
    "Junior\n(1-2 Jahre)",
    "Mid-Level\n(3-5 Jahre)",
    "Senior\n(6-8 Jahre)",
]
participant_counts = [2, 5, 3, 2]  # Total: 12 participants
percentages = [count / 12 * 100 for count in participant_counts]

# Create figure with specific dimensions for scientific publication
fig, ax = plt.subplots(1, 1, figsize=(8, 5))

# Bar chart
bars = ax.bar(
    experience_groups,
    participant_counts,
    color=["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
    edgecolor="black",
    linewidth=1.2,
    alpha=0.8,
)

# Add value labels on bars
for i, (bar, count, pct) in enumerate(zip(bars, participant_counts, percentages)):
    height = bar.get_height()
    ax.text(
        bar.get_x() + bar.get_width() / 2.0,
        height + 0.05,
        f"{count}\n({pct:.1f}%)",
        ha="center",
        va="bottom",
        fontweight="bold",
        fontsize=10,
    )

ax.set_ylabel("Anzahl Teilnehmer", fontweight="bold", fontsize=12)
ax.set_xlabel("Berufserfahrungsgruppen", fontweight="bold", fontsize=12)
ax.set_title(
    "Verteilung der Berufserfahrung in der Stichprobe (n=12)",
    fontweight="bold",
    fontsize=14,
    pad=20,
)
ax.set_ylim(0, max(participant_counts) + 1)
ax.grid(axis="y", alpha=0.3)

# Adjust layout
plt.tight_layout()
# Statistical summary for scientific rigor

# Save figure in high resolution for publication
plt.savefig(
    "output/berufserfahrung_stichprobe.png",
    dpi=300,
    bbox_inches="tight",
    facecolor="white",
    edgecolor="none",
)
# plt.show()
