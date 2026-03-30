from app.services.nutrition_analysis import analyze_nutrition


def test_high_sugar_product():
    """
    Test that high sugar is marked as red and high %.
    """

    product = {
        "sugars": 30, 
        "fat": 1,
        "saturated_fat": 1,
        "salt": 0.1
    }

    result = analyze_nutrition(product)

    assert result["sugars"]["level"] == "red"
    assert result["sugars"]["percent_daily"] > 50


def test_low_salt_product():
    """
    Test low salt gives green level.
    """

    product = {
        "sugars": 2,
        "fat": 1,
        "saturated_fat": 1,
        "salt": 0.1
    }

    result = analyze_nutrition(product)

    assert result["salt"]["level"] == "green"