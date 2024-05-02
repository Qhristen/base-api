
export const getCheckString = (data: URLSearchParams) =>{
	const items: [k: string, v: string][] = [];

	// remove hash
	for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

	return items.sort(([a], [b]) => a.localeCompare(b)) // sort keys
		.map(([k, v]) => `${k}=${v}`) // combine key-value pairs
		.join("\n");
}