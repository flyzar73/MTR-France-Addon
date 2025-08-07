package fr.mtrfranceaddon;

import org.mtr.mapping.holder.Identifier;

public class Constants {

    /**
     * Identifier of the mod.
     */
    public static final String MOD_ID = "mtrfranceaddon";

    /**
     * Name of the mod.
     */
    public static final String MOD_NAME = "MTR France Addon";

    /**
     * Version of the mod.
     */
    public static final String MOD_VERSION = "1.0.0";

    /**
     * Method to create an Identifier based on the MOD_ID.
     * @param id identifier of the ressource.
     * @return The generated identifier (ex: "mtrfranceaddon:example_block")
     */
    public static Identifier id(String id) {
        return new Identifier(MOD_ID, id);
    }

}
