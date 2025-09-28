-- Create the exec_sql function if it doesn't exist
-- This function allows the API to execute SQL statements

CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS TABLE(result jsonb) AS $$
DECLARE
    rec record;
    result_array jsonb := '[]'::jsonb;
    temp_result jsonb;
BEGIN
    -- Execute the query and return results as JSONB
    FOR rec IN EXECUTE sql_query LOOP
        temp_result := to_jsonb(rec);
        result_array := result_array || temp_result;
    END LOOP;
    
    -- If no results, return empty array
    IF result_array = '[]'::jsonb THEN
        RETURN QUERY SELECT '[]'::jsonb;
    ELSE
        -- Return each row as a separate result
        FOR temp_result IN SELECT jsonb_array_elements(result_array) LOOP
            RETURN QUERY SELECT temp_result;
        END LOOP;
    END IF;
    
    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        -- Return error information
        RETURN QUERY SELECT jsonb_build_object(
            'error', SQLERRM,
            'sqlstate', SQLSTATE,
            'query', sql_query
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
-- GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
