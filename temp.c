#include <stdio.h>
#include <stdlib.h>

int main() {
    char hexStr[10];
    char *endptr;
    int value;

    printf("Enter a hex value (like 0x7E): ");
    scanf("%s", hexStr);

    value = strtol(hexStr, &endptr, 0);

    // Check if conversion failed
    if (*endptr != '\0') {
        printf("\nInvalid input! Please enter a valid hex (e.g., 0x7E or 7E)\n");
        return 1;
    }

    printf("\nHex String: %s", hexStr);
    printf("\nDecimal Value: %d", value);
    printf("\nCharacter: %c\n", value);

    return 0;
}

