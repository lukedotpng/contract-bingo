export function ParseBulkContractIds(contractIds: string):
    | {
          contracts: Contract[];
          error?: undefined;
      }
    | { error: string } {
    const PLATFORM_COUNT = 5;
    const contracts: Contract[] = [];
    const lines = contractIds.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
            continue;
        }
        const ids = lines[i].split(",");

        let epicId: string | undefined;
        let steamId: string | undefined;
        let playstationId: string | undefined;
        let xboxId: string | undefined;
        let switchId: string | undefined;
        let contractLocation: ContractLocation | undefined;
        for (let k = 0; k < PLATFORM_COUNT; k++) {
            if (ids[k] === undefined || ids[k].trim() === "") {
                continue;
            }
            const contractInfo = ParseContractId(ids[k]);
            if (contractInfo.error !== undefined) {
                return {
                    error: `${contractInfo.error} -> ${ids[k]} at line ${i + 1}`,
                };
            }

            const contractPlatformId = parseInt(contractInfo.id[0]);
            // Seperate variable for when k is 0 but needs to be compared
            // to a platform id of 1
            const platformIndex = Math.max(1, k);
            if (platformIndex !== contractPlatformId) {
                return {
                    error: `Failed to parse contract platform : "${contractInfo.id}" at line ${i + 1}`,
                };
            }
            switch (k) {
                case 0:
                    epicId = contractInfo.id;
                    break;
                case 1:
                    steamId = contractInfo.id;
                    break;
                case 2:
                    playstationId = contractInfo.id;
                    break;
                case 3:
                    xboxId = contractInfo.id;
                    break;
                case 4:
                    switchId = contractInfo.id;
                    break;
            }
            if (
                contractLocation !== undefined &&
                contractLocation !== contractInfo.location
            ) {
                return {
                    error: `Inconsistent contract locations : "${contractInfo.id}" at line ${i + 1}`,
                };
            }
            contractLocation = contractInfo.location;
        }
        if (contractLocation === undefined) {
            return {
                error: `Failed to parse contract location : Line ${i + 1}`,
            };
        }
        contracts.push({
            id: crypto.randomUUID(),
            epicId: epicId,
            steamId: steamId,
            playstationId: playstationId,
            xboxId: xboxId,
            switchId: switchId,
            location: contractLocation,
        });
    }
    return { contracts: contracts };
}

export function ParseContractId(contractId: string):
    | {
          id: string;
          location: ContractLocation;
          error?: undefined;
      }
    | {
          error: string;
      } {
    const contractIdRegex = /^[1234]-[0-9]{2}-[0-9]{7}-[0-9]{2}$/;
    contractId = contractId.trim();

    if (!contractIdRegex.test(contractId)) {
        return {
            error: "Failed to parse contract ID",
        };
    }

    const contractLocation = GetContractLocation(contractId);
    if (!contractLocation) {
        return {
            error: "Failed to parse contract location",
        };
    }

    return {
        id: contractId,
        location: contractLocation,
    };
}

function GetContractLocation(contractId: string): ContractLocation | null {
    const contractLocationIdRegex = /^[1234]-([0-9]{2})-[0-9]{7}-[0-9]{2}$/;
    const contractLocationMap = new Map<number, ContractLocation>([
        [99, "freeform_training"],
        [1, "the_final_test"],
        [2, "the_showstopper"],
        [3, "world_of_tomorrow"],
        [6, "a_gilded_cage"],
        [8, "club_27"],
        [9, "freedom_fighters"],
        [10, "situs_inversus"],
        [20, "nightcall"],
        [11, "the_finish_line"],
        [12, "three-headed_serpent"],
        [13, "chasing_a_ghost"],
        [22, "another_life"],
        [21, "the_ark_society"],
        [24, "golden_handshake"],
        [26, "the_last_resort"],
        [34, "shadows_in_the_water"],
        [27, "on_top_of_the_world"],
        [28, "death_in_the_family"],
        [33, "the_dartmoor_garden_show"],
        [29, "apex_predator"],
        [30, "end_of_an_era"],
        [31, "the_farewell"],
        [36, "holiday_hoarders"],
        [4, "landslide"],
        [5, "the_icon"],
        [15, "the_author"],
        [7, "a_house_built_on_sand"],
        [16, "the_source"],
        [18, "patient_zero"],
        [37, "hokkaido_snow_festival"],
    ]);

    const contractLocationIdMatch = contractId.match(contractLocationIdRegex);
    if (!contractLocationIdMatch) {
        return null;
    }
    const contractLocationId = parseInt(contractLocationIdMatch[1]);

    const contractLocation = contractLocationMap.get(contractLocationId);

    if (contractLocation) {
        return contractLocation;
    } else {
        return null;
    }
}
