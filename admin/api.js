const BASE_URL = "https://6a5de28f0ad09982aef7b477.mockapi.io";


// MENU API

export async function getMenu() {
    const res = await fetch(`${BASE_URL}/Menu`);
    return await res.json();
}

export async function addMenu(item) {
    const res = await fetch(`${BASE_URL}/Menu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return await res.json();
}

export async function updateMenu(id, item) {
    const res = await fetch(`${BASE_URL}/Menu/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return await res.json();
}

export async function deleteMenu(id) {
    await fetch(`${BASE_URL}/Menu/${id}`, {
        method: "DELETE"
    });
}



// CATEGORY API

export async function getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    return await res.json();
}

export async function addCategory(category) {
    const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    });

    return await res.json();
}

export async function deleteCategory(id) {
    await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE"
    });
}