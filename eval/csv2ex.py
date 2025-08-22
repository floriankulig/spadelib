import pandas as pd
import numpy as np
import re
from pathlib import Path
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils.dataframe import dataframe_to_rows


def compress_survey_data(csv_file_path, excel_output_path):
    """
    Compresses survey data with multiple output formats for better readability.

    Args:
        csv_file_path (str): Path to the input CSV file
        excel_output_path (str): Path for the output Excel file
    """

    # Load the CSV data
    df = pd.read_csv(csv_file_path)

    # Create basic info dataframe
    basic_columns = [
        "Response ID",
        "Date submitted",
        "Last page",
        "Start language",
        "Seed",
        "Date started",
        "Date last action",
    ]

    basic_df = pd.DataFrame()
    for col in basic_columns:
        if col in df.columns:
            basic_df[col] = df[col]

    # Simple single-answer questions
    simple_questions = {
        "Role": "Which role best describes your position?",
        "Framework": "Which Framework are you using in your current project?",
        "Component_Ratio": "How would you estimate the proportion of reused components from libraries compared to individually created components in your projects?",
        "Time_Per_Sprint": "How much time do you spend on average per sprint (~3 weeks) adapting or overriding components from standard libraries?",
        "Reimplementation_Frequency": "How often do you need to completely reimplement components that already exist in a library to fulfill client requirements?",
        "Satisfaction_Rating": "How satisfied are you overall with the currently available UI component libraries for enterprise projects?",
        "Preferred_Approach": "If you could develop your own component library for your project / Capgemini-wide, which of the following approaches would interest you the most?",
        "Multi_Framework_Work": "Do you work on projects with multiple frontend frameworks simultaneously?",
    }

    # Create simple answers dataframe
    simple_df = basic_df.copy()
    for new_col, original_col in simple_questions.items():
        if original_col in df.columns:
            simple_df[new_col] = df[original_col]

    def extract_multiple_choice_clean(df, base_question, response_col="Response ID"):
        """Extract multiple choice in a clean format with line breaks"""
        matching_cols = [col for col in df.columns if col.startswith(base_question)]

        result_data = []

        for idx, row in df.iterrows():
            response_id = row.get(response_col, idx + 1)
            selected_options = []

            for col in matching_cols:
                value = row[col]

                if pd.isna(value) or value == "":
                    continue

                # Extract option name
                if "[" in col and "]" in col:
                    option = col.split("[")[1].split("]")[0]
                else:
                    option = col.replace(base_question, "").strip()
                    if option.startswith(" [") and option.endswith("]"):
                        option = option[2:-1]

                # Handle different value types
                if isinstance(value, str):
                    if value.lower() in ["selected", "yes", "true"]:
                        selected_options.append(option)
                    elif value not in ["not selected", "no", "false", ""]:
                        selected_options.append(f"{option}")
                elif isinstance(value, (int, float)) and not pd.isna(value):
                    selected_options.append(option)

            # Use line breaks instead of semicolons for better readability
            result = "\n".join(selected_options) if selected_options else ""
            result_data.append({"Response ID": response_id, "Answers": result})

        return pd.DataFrame(result_data)

    def extract_ratings_clean(df, base_question, response_col="Response ID"):
        """Extract rating questions in a clean format"""
        matching_cols = [col for col in df.columns if col.startswith(base_question)]

        result_data = []

        for idx, row in df.iterrows():
            response_id = row.get(response_col, idx + 1)
            ratings = []

            for col in matching_cols:
                value = row[col]

                if pd.isna(value) or value == "":
                    continue

                # Extract option name
                if "[" in col and "]" in col:
                    option = col.split("[")[1].split("]")[0]
                else:
                    option = col.replace(base_question, "").strip()

                if isinstance(value, (int, float)) and not pd.isna(value):
                    rating_map = {
                        1: "unimportant",
                        2: "somewhat unimportant",
                        3: "nice to have",
                        4: "important",
                        5: "very important",
                    }
                    rating_text = rating_map.get(int(value), str(int(value)))
                    ratings.append(f"{option}: {rating_text}")
                elif isinstance(value, str) and value.strip():
                    ratings.append(f"{option}: {value}")

            result = "\n".join(ratings) if ratings else ""
            result_data.append({"Response ID": response_id, "Ratings": result})

        return pd.DataFrame(result_data)

    # Extract different question types
    ui_libraries = extract_multiple_choice_clean(
        df,
        "Which UI component libraries are you currently using or have used in enterprise projects within the last 2 years?",
    )
    ui_libraries.rename(columns={"Answers": "UI_Libraries_Used"}, inplace=True)

    challenges = extract_multiple_choice_clean(
        df,
        "What are the biggest challenges when using UI component libraries in the customer projects you were a part of?",
    )
    challenges.rename(columns={"Answers": "Biggest_Challenges"}, inplace=True)

    accessibility_standards = extract_multiple_choice_clean(
        df, "Which accessibility standards do you need to meet in your projects?"
    )
    accessibility_standards.rename(
        columns={"Answers": "Accessibility_Standards"}, inplace=True
    )

    accessibility_testing = extract_multiple_choice_clean(
        df, "How do you currently test accessibility in your applications?"
    )
    accessibility_testing.rename(
        columns={"Answers": "Accessibility_Testing"}, inplace=True
    )

    importance_ratings = extract_ratings_clean(
        df,
        "Please rate the following aspects according to their importance for an ideal component library in your (previous) project context.",
    )
    importance_ratings.rename(columns={"Ratings": "Importance_Ratings"}, inplace=True)

    # Merge all data
    final_df = simple_df.copy()

    for additional_df in [
        ui_libraries,
        challenges,
        accessibility_standards,
        accessibility_testing,
        importance_ratings,
    ]:
        final_df = final_df.merge(additional_df, on="Response ID", how="left")

    # Add open-ended questions
    open_questions = {
        "Biggest_Frustration": "What is your biggest frustration when working with existing component libraries in enterprise projects?",
        "Innovative_Approaches": "What innovative approaches or best practices have you found to overcome challenges with component libraries?",
        "Accessibility_Challenges": "What are your biggest challenges when implementing accessibility in client projects?",
    }

    for new_col, original_col in open_questions.items():
        if original_col in df.columns:
            final_df[new_col] = df[original_col]

    # Create long format for analysis
    long_format_data = []

    for idx, row in final_df.iterrows():
        response_id = row["Response ID"]

        # Add simple questions
        for col in [
            "Role",
            "Framework",
            "Component_Ratio",
            "Time_Per_Sprint",
            "Reimplementation_Frequency",
            "Satisfaction_Rating",
            "Preferred_Approach",
        ]:
            if col in row and pd.notna(row[col]) and row[col] != "":
                long_format_data.append(
                    {
                        "Response_ID": response_id,
                        "Question_Category": col,
                        "Answer": row[col],
                    }
                )

        # Add multiple choice questions
        for col, full_name in [
            ("UI_Libraries_Used", "UI Libraries Used"),
            ("Biggest_Challenges", "Biggest Challenges"),
            ("Accessibility_Standards", "Accessibility Standards"),
            ("Accessibility_Testing", "Accessibility Testing"),
        ]:
            if col in row and pd.notna(row[col]) and row[col] != "":
                for answer in row[col].split("\n"):
                    if answer.strip():
                        long_format_data.append(
                            {
                                "Response_ID": response_id,
                                "Question_Category": full_name,
                                "Answer": answer.strip(),
                            }
                        )

        # Add importance ratings
        if (
            "Importance_Ratings" in row
            and pd.notna(row["Importance_Ratings"])
            and row["Importance_Ratings"] != ""
        ):
            for rating in row["Importance_Ratings"].split("\n"):
                if rating.strip():
                    long_format_data.append(
                        {
                            "Response_ID": response_id,
                            "Question_Category": "Importance Rating",
                            "Answer": rating.strip(),
                        }
                    )

    long_format_df = pd.DataFrame(long_format_data)

    # Create summary statistics
    summary_data = []

    # Role distribution
    if "Role" in final_df.columns:
        role_counts = final_df["Role"].value_counts()
        for role, count in role_counts.items():
            summary_data.append(
                {
                    "Category": "Role",
                    "Item": role,
                    "Count": count,
                    "Percentage": f"{count/len(final_df)*100:.1f}%",
                }
            )

    # Framework distribution
    if "Framework" in final_df.columns:
        framework_counts = final_df["Framework"].value_counts()
        for framework, count in framework_counts.items():
            summary_data.append(
                {
                    "Category": "Framework",
                    "Item": framework,
                    "Count": count,
                    "Percentage": f"{count/len(final_df)*100:.1f}%",
                }
            )

    # Most mentioned challenges
    if "Biggest_Challenges" in final_df.columns:
        all_challenges = []
        for challenges_text in final_df["Biggest_Challenges"].dropna():
            all_challenges.extend(
                [c.strip() for c in challenges_text.split("\n") if c.strip()]
            )

        challenge_counts = pd.Series(all_challenges).value_counts().head(10)
        for challenge, count in challenge_counts.items():
            summary_data.append(
                {
                    "Category": "Top Challenges",
                    "Item": challenge,
                    "Count": count,
                    "Percentage": f"{count/len(final_df)*100:.1f}%",
                }
            )

    summary_df = pd.DataFrame(summary_data)

    # Save to Excel with multiple sheets
    with pd.ExcelWriter(excel_output_path, engine="openpyxl") as writer:
        # Main compressed data
        final_df.to_excel(writer, sheet_name="Compressed_Data", index=False)

        # Long format for analysis
        long_format_df.to_excel(writer, sheet_name="Long_Format", index=False)

        # Summary statistics
        summary_df.to_excel(writer, sheet_name="Summary", index=False)

        # Separate sheets for each question type
        ui_libraries_full = final_df[["Response ID", "UI_Libraries_Used"]].copy()
        ui_libraries_full.to_excel(writer, sheet_name="UI_Libraries", index=False)

        challenges_full = final_df[["Response ID", "Biggest_Challenges"]].copy()
        challenges_full.to_excel(writer, sheet_name="Challenges", index=False)

        ratings_full = final_df[["Response ID", "Importance_Ratings"]].copy()
        ratings_full.to_excel(writer, sheet_name="Importance_Ratings", index=False)

        # Format the worksheets
        for sheet_name in writer.sheets:
            worksheet = writer.sheets[sheet_name]

            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter

                for cell in column:
                    try:
                        # Handle multi-line content
                        cell_value = str(cell.value) if cell.value else ""
                        lines = cell_value.split("\n")
                        max_line_length = (
                            max([len(line) for line in lines]) if lines else 0
                        )

                        if max_line_length > max_length:
                            max_length = max_line_length
                    except:
                        pass

                adjusted_width = min(max_length + 2, 80)
                worksheet.column_dimensions[column_letter].width = adjusted_width

            # Enable text wrapping for all cells
            for row in worksheet.iter_rows():
                for cell in row:
                    cell.alignment = Alignment(wrap_text=True, vertical="top")

    print(f"✅ Enhanced survey data compression complete!")
    print(f"📊 Original columns: {len(df.columns)}")
    print(f"📊 Compressed columns: {len(final_df.columns)}")
    print(f"📁 Output saved to: {excel_output_path}")
    print(f"📋 Sheets created:")
    print(f"   - Compressed_Data: Main data with line breaks")
    print(f"   - Long_Format: Analysis-friendly format")
    print(f"   - Summary: Key statistics")
    print(f"   - UI_Libraries: Library usage details")
    print(f"   - Challenges: Challenge details")
    print(f"   - Importance_Ratings: Rating details")

    return final_df, long_format_df, summary_df


def main():
    """Main function to run the enhanced compression"""

    csv_file = "results-survey.csv"
    excel_file = "survey_results_enhanced.xlsx"

    if not Path(csv_file).exists():
        print(f"❌ Error: CSV file '{csv_file}' not found!")
        return

    try:
        final_df, long_df, summary_df = compress_survey_data(csv_file, excel_file)

        print(f"\n📈 Summary Statistics:")
        print(f"Total responses: {len(final_df)}")

        # Show top insights
        print(f"\n🔍 Key Insights:")
        if "Role" in final_df.columns:
            top_role = final_df["Role"].value_counts().index[0]
            print(f"   Most common role: {top_role}")

        if "Framework" in final_df.columns:
            top_framework = final_df["Framework"].value_counts().index[0]
            print(f"   Most used framework: {top_framework}")

        print(f"\n✨ Enhanced compression complete!")
        print(f"💡 Tip: Check the different sheets for various data views")

    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == "__main__":
    main()
