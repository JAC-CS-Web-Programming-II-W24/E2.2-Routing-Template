export interface Pokemon {
	id: number;
	name: string;
	type: string;
}

export const party: Pokemon[] = [{ id: 1, name: "Pikachu", type: "Electric" }];
