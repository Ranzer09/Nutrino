def test_product_not_found(client):
    """
    Test invalid barcode returns 404.
    """

    response = client.get("/products/invalid-barcode")

    assert response.status_code == 404
    assert "not found" in response.json()["message"].lower()


def test_health_endpoint(client):
    """
    Basic health check.
    """

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"