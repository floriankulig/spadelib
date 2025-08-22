import pandas as pd
import numpy as np
from pathlib import Path
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl import Workbook


def process_survey_for_appendix(csv_file_path, excel_output_path):
    """
    Processes survey data into a single, appendix-ready table with statistics.

    Args:
        csv_file_path (str): Path to the input CSV file
        excel_output_path (str): Path for the output Excel file
    """

    # Load the CSV data
    df = pd.read_csv(csv_file_path)

    # Define column mappings for clear, German headers
    column_mappings = {
        "Response ID": "Antwort-ID",
        "Which role best describes your position?": "Rolle",
        "Which Framework are you using in your current project?": "Framework",
        "How would you estimate the proportion of reused components from libraries compared to individually created components in your projects?": "Komponenten-Verhältnis",
        "How much time do you spend on average per sprint (~3 weeks) adapting or overriding components from standard libraries?": "Zeitaufwand pro Sprint",
        "How often do you need to completely reimplement components that already exist in a library to fulfill client requirements?": "Neuimplementierung Häufigkeit",
        "How satisfied are you overall with the currently available UI component libraries for enterprise projects?": "Zufriedenheit (1-5)",
        "If you could develop your own component library for your project / Capgemini-wide, which of the following approaches would interest you the most?": "Bevorzugter Ansatz",
        "Do you work on projects with multiple frontend frameworks simultaneously?": "Multi-Framework Arbeit",
    }

    def extract_multiple_choice_selected(df, base_question):
        """Extract only selected options from multiple choice questions"""
        matching_cols = [col for col in df.columns if col.startswith(base_question)]

        result_series = []

        for idx, row in df.iterrows():
            selected_options = []

            for col in matching_cols:
                value = row[col]

                # Skip empty/nan values
                if pd.isna(value) or value == "" or value == "Not selected":
                    continue

                # Extract option name from column header
                if "[" in col and "]" in col:
                    option = col.split("[")[1].split("]")[0]
                else:
                    # Fallback extraction
                    option = col.replace(base_question, "").strip()
                    if option.startswith(" [") and option.endswith("]"):
                        option = option[2:-1]

                # Check if this option is selected
                if isinstance(value, str):
                    if value.lower() in ["selected", "yes", "true", "1"]:
                        selected_options.append(option)
                    elif value.lower() not in ["not selected", "no", "false", "0", ""]:
                        # If it's not a standard selection indicator, treat as selected
                        selected_options.append(option)
                elif (
                    isinstance(value, (int, float))
                    and not pd.isna(value)
                    and value != 0
                ):
                    selected_options.append(option)

            # Join with semicolons for compact display
            result = "; ".join(selected_options) if selected_options else ""
            result_series.append(result)

        return pd.Series(result_series, name=base_question)

    # Start with basic columns
    result_df = pd.DataFrame()

    # Add Response ID if available
    if "Response ID" in df.columns:
        result_df["Antwort-ID"] = df["Response ID"]
    else:
        result_df["Antwort-ID"] = range(1, len(df) + 1)

    # Add simple single-answer questions
    for original_col, german_col in column_mappings.items():
        if original_col in df.columns and original_col != "Response ID":
            result_df[german_col] = df[original_col]

    # Process multiple choice questions
    ui_libraries_question = "Which UI component libraries are you currently using or have used in enterprise projects within the last 2 years?"
    if any(col.startswith(ui_libraries_question) for col in df.columns):
        ui_libraries_series = extract_multiple_choice_selected(
            df, ui_libraries_question
        )
        result_df["Verwendete UI Libraries"] = ui_libraries_series

    challenges_question = "What are the biggest challenges when using UI component libraries in the customer projects you were a part of?"
    if any(col.startswith(challenges_question) for col in df.columns):
        challenges_series = extract_multiple_choice_selected(df, challenges_question)
        result_df["Größte Herausforderungen"] = challenges_series

    accessibility_standards_question = (
        "Which accessibility standards do you need to meet in your projects?"
    )
    if any(col.startswith(accessibility_standards_question) for col in df.columns):
        accessibility_standards_series = extract_multiple_choice_selected(
            df, accessibility_standards_question
        )
        result_df["Accessibility Standards"] = accessibility_standards_series

    accessibility_testing_question = (
        "How do you currently test accessibility in your applications?"
    )
    if any(col.startswith(accessibility_testing_question) for col in df.columns):
        accessibility_testing_series = extract_multiple_choice_selected(
            df, accessibility_testing_question
        )
        result_df["Accessibility Testing"] = accessibility_testing_series

    # Add importance ratings as a single column
    importance_base_question = "Please rate the following aspects according to their importance for an ideal component library"
    importance_cols = [
        col for col in df.columns if col.startswith(importance_base_question)
    ]

    if importance_cols:
        importance_ratings = []
        for idx, row in df.iterrows():
            ratings = []
            for col in importance_cols:
                value = row[col]
                if pd.isna(value) or value == "":
                    continue

                # Extract aspect name
                if "[" in col and "]" in col:
                    aspect = col.split("[")[1].split("]")[0]
                else:
                    aspect = col.replace(importance_base_question, "").strip()

                if isinstance(value, (int, float)) and not pd.isna(value):
                    rating_map = {
                        1: "unwichtig",
                        2: "eher unwichtig",
                        3: "nice to have",
                        4: "wichtig",
                        5: "sehr wichtig",
                    }
                    rating_text = rating_map.get(int(value), str(int(value)))
                    ratings.append(f"{aspect}: {rating_text}")

            importance_ratings.append("; ".join(ratings) if ratings else "")

        result_df["Wichtigkeits-Bewertungen"] = importance_ratings

    # Add open-ended questions
    open_questions = {
        "What is your biggest frustration when working with existing component libraries in enterprise projects?": "Größte Frustration",
        "What innovative approaches or best practices have you found to overcome challenges with component libraries?": "Innovative Ansätze",
        "What are your biggest challenges when implementing accessibility in client projects?": "Accessibility Herausforderungen",
    }

    for original_col, german_col in open_questions.items():
        if original_col in df.columns:
            result_df[german_col] = df[original_col]

    # Calculate statistics for footer
    stats_data = []

    for col in result_df.columns:
        if col == "Antwort-ID":
            continue

        # Count non-empty responses
        non_empty = result_df[col].dropna()
        non_empty = non_empty[non_empty != ""]
        total_responses = len(non_empty)

        if total_responses == 0:
            stats_data.append("")
            continue

        # For categorical data, show top 3 responses
        if col in [
            "Rolle",
            "Framework",
            "Komponenten-Verhältnis",
            "Zeitaufwand pro Sprint",
            "Neuimplementierung Häufigkeit",
            "Bevorzugter Ansatz",
            "Multi-Framework Arbeit",
        ]:
            value_counts = non_empty.value_counts()
            if len(value_counts) > 0:
                top_responses = []
                for i, (response, count) in enumerate(value_counts.head(3).items()):
                    percentage = (count / total_responses) * 100
                    top_responses.append(
                        f"{response} ({percentage:.1f}%)".replace(".", ",")
                    )
                stats_data.append("Top 3:\n" + "\n".join(top_responses))
            else:
                stats_data.append("")

        # For satisfaction rating, calculate average
        elif col == "Zufriedenheit (1-5)":
            try:
                numeric_values = pd.to_numeric(non_empty, errors="coerce").dropna()
                if len(numeric_values) > 0:
                    avg_rating = numeric_values.mean()
                    stats_data.append(
                        f"Durchschnitt: {avg_rating:.2f}".replace(".", ",")
                    )
                else:
                    stats_data.append("")
            except:
                stats_data.append("")

        # For multiple choice questions, show top 3 selections
        elif col in [
            "Verwendete UI Libraries",
            "Größte Herausforderungen",
            "Accessibility Standards",
            "Accessibility Testing",
        ]:
            all_selections = []
            for response in non_empty:
                if response and response != "":
                    selections = [s.strip() for s in response.split(";") if s.strip()]
                    all_selections.extend(selections)

            if all_selections:
                selection_counts = pd.Series(all_selections).value_counts().head(3)
                top_selections = []
                for selection, count in selection_counts.items():
                    percentage = (count / total_responses) * 100
                    top_selections.append(
                        f"{selection} ({percentage:.1f}%)".replace(".", ",")
                    )
                stats_data.append("Top 3:\n" + "\n".join(top_selections))
            else:
                stats_data.append("")

        # For text fields, show response rate
        else:
            response_rate = (total_responses / len(result_df)) * 100
            stats_data.append(f"Antwortrate: {response_rate:.1f}%".replace(".", ","))

    # Add statistics row
    stats_row = ["STATISTIKEN"] + stats_data

    # Create final dataframe with statistics
    final_df = result_df.copy()

    # Save to Excel with formatting
    with pd.ExcelWriter(excel_output_path, engine="openpyxl") as writer:
        # Write main data
        final_df.to_excel(writer, sheet_name="Umfrageergebnisse", index=False)

        # Get the worksheet
        worksheet = writer.sheets["Umfrageergebnisse"]

        # Add statistics row
        stats_row_index = len(final_df) + 3  # Leave a gap
        for col_idx, stat in enumerate(stats_row):
            cell = worksheet.cell(row=stats_row_index, column=col_idx + 1)
            cell.value = stat
            cell.alignment = Alignment(
                wrap_text=True, vertical="top"
            )  # Enable wrap text for statistics
            if col_idx == 0:  # First column header
                cell.font = Font(bold=True)
                cell.fill = PatternFill(
                    start_color="E6E6E6", end_color="E6E6E6", fill_type="solid"
                )
            else:
                cell.font = Font(size=9)

        # Set row height for statistics row to accommodate multiple lines
        worksheet.row_dimensions[stats_row_index].height = 60

        # Format the worksheet
        # Auto-adjust column widths
        for column in worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter

            for cell in column:
                try:
                    # Handle multi-line content
                    cell_value = str(cell.value) if cell.value else ""
                    # For statistics row, limit display length
                    if cell.row == stats_row_index and len(cell_value) > 100:
                        cell_value = cell_value[:100] + "..."

                    lines = (
                        cell_value.split("\n")
                        if "\n" in cell_value
                        else cell_value.split(";")
                    )
                    max_line_length = max([len(line) for line in lines]) if lines else 0

                    if max_line_length > max_length:
                        max_length = max_line_length
                except:
                    pass

            # Set reasonable column width limits
            adjusted_width = min(max(max_length + 2, 15), 60)
            worksheet.column_dimensions[column_letter].width = adjusted_width

        # Format header row
        for cell in worksheet[1]:
            cell.font = Font(bold=True)
            cell.fill = PatternFill(
                start_color="D9E2F3", end_color="D9E2F3", fill_type="solid"
            )
            cell.alignment = Alignment(wrap_text=True, vertical="top")

        # Format data rows
        for row in worksheet.iter_rows(min_row=2, max_row=len(final_df) + 1):
            for cell in row:
                cell.alignment = Alignment(wrap_text=True, vertical="top")

        # Add borders
        thin_border = Border(
            left=Side(style="thin"),
            right=Side(style="thin"),
            top=Side(style="thin"),
            bottom=Side(style="thin"),
        )

        for row in worksheet.iter_rows(min_row=1, max_row=len(final_df) + 1):
            for cell in row:
                cell.border = thin_border

    print(f"✅ Survey data processed for appendix!")
    print(f"📁 Output saved to: {excel_output_path}")

    return final_df


def main():
    """Main function to process survey data for appendix"""

    csv_file = "results-survey.csv"
    excel_file = "survey_results_appendix.xlsx"

    if not Path(csv_file).exists():
        print(f"❌ Error: CSV file '{csv_file}' not found!")
        print("Available files:")
        for file in Path(".").glob("*.csv"):
            print(f"  - {file.name}")
        return

    try:
        result_df = process_survey_for_appendix(csv_file, excel_file)
        print(f"✨ Appendix-ready table created successfully!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
